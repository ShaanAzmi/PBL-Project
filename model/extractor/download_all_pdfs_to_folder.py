"""
Collect and download all PDF links (including Google Drive) from the IDSP Weekly Outbreaks site
into a fresh directory to ensure nothing is skipped by previous runs.

Usage:
    cd extractor
    python download_all_pdfs_to_folder.py

This script will:
- Create `../data/raw/idsp_pdfs_all/` (relative to repository root)
- Crawl the main page and all weekly pages to collect PDF/Drive links
- Convert Drive links to direct download links
- Download every unique URL into the folder (force download)

Note: Stop other running downloader scripts before running to avoid parallel downloads.
"""

from pathlib import Path
from urllib.parse import urljoin
import logging
import time
from bs4 import BeautifulSoup

from pdf_downloader import IDSPPDFDownloader

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger('download_all')


def main():
    base_url = "https://idsp.mohfw.gov.in/index4.php?lang=1&level=0&linkid=406&lid=3689"
    target_dir = Path("..") / "data" / "raw" / "idsp_pdfs_all"
    target_dir.mkdir(parents=True, exist_ok=True)

    downloader = IDSPPDFDownloader(base_url=base_url, output_dir=str(target_dir))

    logger.info(f"Collecting PDF links from {base_url}")
    resp = downloader.get_page_content(base_url)
    if not resp:
        logger.error("Failed to fetch main page")
        return
    # decode with replacement to avoid charset detector hangs on malformed pages
    main_html = None
    try:
        main_html = resp.content.decode('utf-8', errors='replace')
    except Exception:
        main_html = resp.text
    soup = BeautifulSoup(main_html, 'html.parser')

    # Collect direct pdf links on main page
    pdf_links = downloader.extract_pdf_links(soup, base_url)
    logger.info(f"Found {len(pdf_links)} direct links on main page")

    # Collect weekly pages
    weekly_links = downloader.extract_weekly_links(soup, base_url)
    logger.info(f"Found {len(weekly_links)} weekly pages to scan")

    # Visit each weekly page and collect links
    all_links = list(pdf_links)
    for idx, item in enumerate(weekly_links):
        week_url = None
        try:
            week_url = item[0] if isinstance(item, (list, tuple)) else item
            r = downloader.get_page_content(week_url)
            if not r:
                continue
            # decode safely
            try:
                html = r.content.decode('utf-8', errors='replace')
            except Exception:
                html = r.text
            week_soup = BeautifulSoup(html, 'html.parser')
            wk = downloader.extract_pdf_links(week_soup, week_url)
            if wk:
                all_links.extend(wk)
            time.sleep(0.25)
            if (idx + 1) % 100 == 0:
                logger.info(f"Scanned {idx+1}/{len(weekly_links)} weekly pages")
        except Exception as e:
            logger.warning(f"Error scanning weekly page {week_url}: {e}")

    # Normalize and deduplicate URLs
    unique = {}
    for url, name in all_links:
        if url not in unique:
            unique[url] = name

    logger.info(f"Total unique URLs collected: {len(unique)}")

    # Download every unique URL into target_dir (force download even if files with same name exist)
    i = 0
    for url, name in unique.items():
        i += 1
        # Derive filename
        fname = downloader.extract_name_from_url(url)
        # For Google Drive converted links, extract id-based name to avoid collisions
        if 'drive.google.com' in url or 'uc?export=download' in url:
            # use the provided name if meaningful; otherwise use derived
            if not name or name.endswith('.pdf') is False:
                # try to create name from original "name" value
                fname = f"drive_{i}.pdf"
        # sanitize
        fname = downloader.sanitize_filename(fname)

        outpath = target_dir / fname
        # If file already exists, append index
        if outpath.exists():
            outpath = target_dir / f"{outpath.stem}_{i}.pdf"

        logger.info(f"[{i}/{len(unique)}] Downloading {url} -> {outpath.name}")
        # Use the downloader's methods to write the file
        try:
            # If it's a Google Drive link, use the special handler
            if 'drive.google.com' in url or 'uc?export' in url:
                success = downloader.download_from_google_drive(url, outpath)
            else:
                # simple streaming download
                resp = downloader.get_page_content(url)
                if resp and resp.status_code == 200:
                    with open(outpath, 'wb') as f:
                        f.write(resp.content)
                    success = True
                else:
                    success = False
            if not success:
                logger.warning(f"Failed to download: {url}")
        except Exception as e:
            logger.error(f"Exception downloading {url}: {e}")

    logger.info("All downloads attempted. Check the folder for results.")


if __name__ == '__main__':
    main()
