"""
IDSP Weekly Outbreaks PDF Downloader

This script downloads all weekly outbreak PDFs from the IDSP (Integrated Disease 
Surveillance Programme) website for analysis and disease prediction modeling.

URL: https://idsp.mohfw.gov.in/index4.php?lang=1&level=0&linkid=406&lid=3689
"""

import requests
from bs4 import BeautifulSoup
import os
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse
import logging
from tqdm import tqdm
import re
import json

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('pdf_downloader.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class IDSPPDFDownloader:
    """Downloads PDF files from IDSP Weekly Outbreaks page."""
    
    def __init__(self, base_url, output_dir='../data/raw/idsp_pdfs'):
        """
        Initialize the downloader.
        
        Args:
            base_url: The main page URL containing weekly outbreak links
            output_dir: Directory to save downloaded PDFs
        """
        self.base_url = base_url
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Progress tracking file
        self.progress_file = self.output_dir / 'download_progress.json'
        self.scanned_urls = self.load_progress()
        
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        self.downloaded_count = 0
        self.failed_count = 0
        self.skipped_count = 0
    
    def load_progress(self):
        """Load the list of already scanned URLs from progress file."""
        if self.progress_file.exists():
            try:
                with open(self.progress_file, 'r') as f:
                    data = json.load(f)
                    logger.info(f"Loaded progress: {len(data.get('scanned_urls', []))} URLs already scanned")
                    return set(data.get('scanned_urls', []))
            except Exception as e:
                logger.warning(f"Could not load progress file: {e}")
        return set()
    
    def save_progress(self, scanned_urls):
        """Save the list of scanned URLs to progress file."""
        try:
            with open(self.progress_file, 'w') as f:
                json.dump({'scanned_urls': list(scanned_urls)}, f)
        except Exception as e:
            logger.warning(f"Could not save progress: {e}")
        
    def get_page_content(self, url, retries=3):
        """
        Fetch page content with retry logic.
        
        Args:
            url: URL to fetch
            retries: Number of retry attempts
            
        Returns:
            Response object or None if failed
        """
        for attempt in range(retries):
            try:
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                return response
            except requests.RequestException as e:
                logger.warning(f"Attempt {attempt + 1}/{retries} failed for {url}: {e}")
                if attempt < retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    logger.error(f"Failed to fetch {url} after {retries} attempts")
                    return None
    
    def extract_pdf_links(self, soup, page_url):
        """
        Extract all PDF links from the page, including Google Drive links.
        
        Args:
            soup: BeautifulSoup object
            page_url: Current page URL for resolving relative links
            
        Returns:
            List of tuples (pdf_url, pdf_name)
        """
        pdf_links = []
        seen_urls = set()  # Track to avoid duplicates
        
        # Find all links
        for link in soup.find_all('a', href=True):
            href = link['href']
            
            # Check if link points to a PDF or Google Drive
            # Be more specific - avoid navigation/menu links
            if any(indicator in href.lower() for indicator in ['.pdf', 'showfile.php', 'drive.google.com/file', 'docs.google.com/document']):
                # Skip if it's a navigation link
                if any(skip in href.lower() for skip in ['javascript:', '#', 'index.php', 'index1.php', 'index4.php']) and '.pdf' not in href.lower():
                    continue
                    
                # Construct absolute URL
                absolute_url = urljoin(page_url, href)
                
                # Skip if we've seen this URL
                if absolute_url in seen_urls:
                    continue
                seen_urls.add(absolute_url)
                
                # Convert Google Drive links to direct download format
                if 'drive.google.com' in absolute_url or 'docs.google.com' in absolute_url:
                    absolute_url = self.convert_google_drive_link(absolute_url)
                
                # Extract meaningful name from link text or URL
                link_text = link.get_text(strip=True)
                if link_text and not any(nav in link_text.lower() for nav in ['home', 'back', 'next', 'menu']):
                    pdf_name = self.sanitize_filename(link_text)
                else:
                    # Try to extract from URL parameters or path
                    pdf_name = self.extract_name_from_url(absolute_url)
                
                pdf_links.append((absolute_url, pdf_name))
        
        # Also check for embedded iframes with Google Drive content
        for iframe in soup.find_all('iframe', src=True):
            src = iframe['src']
            if 'drive.google.com' in src or 'docs.google.com' in src:
                absolute_url = urljoin(page_url, src)
                
                # Skip if we've seen this URL
                if absolute_url in seen_urls:
                    continue
                seen_urls.add(absolute_url)
                
                absolute_url = self.convert_google_drive_link(absolute_url)
                
                # Try to get a name from nearby text or iframe title
                pdf_name = None
                if iframe.get('title'):
                    pdf_name = self.sanitize_filename(iframe['title'])
                else:
                    # Look for nearby text in parent elements
                    parent = iframe.find_parent()
                    if parent:
                        parent_text = parent.get_text(strip=True)
                        if parent_text and len(parent_text) < 100:
                            pdf_name = self.sanitize_filename(parent_text)
                
                if not pdf_name:
                    pdf_name = f"embedded_document_{hash(src) % 100000}.pdf"
                    
                pdf_links.append((absolute_url, pdf_name))
        
        # Also check for embedded objects (some sites use <object> or <embed> tags)
        for obj in soup.find_all(['object', 'embed'], attrs={'data': True}):
            data_src = obj.get('data') or obj.get('src')
            if data_src and ('drive.google.com' in data_src or '.pdf' in data_src.lower()):
                absolute_url = urljoin(page_url, data_src)
                
                if absolute_url in seen_urls:
                    continue
                seen_urls.add(absolute_url)
                
                if 'drive.google.com' in absolute_url:
                    absolute_url = self.convert_google_drive_link(absolute_url)
                
                pdf_name = self.extract_name_from_url(absolute_url)
                pdf_links.append((absolute_url, pdf_name))
        
        return pdf_links
    
    def extract_weekly_links(self, soup, page_url):
        """
        Extract links to individual week pages that may contain PDFs.
        
        Args:
            soup: BeautifulSoup object
            page_url: Current page URL
            
        Returns:
            List of tuples (weekly_url, display_name, year, week)
        """
        weekly_links = []
        
        # Find all table rows that contain year and week information
        tables = soup.find_all('table')
        
        for table in tables:
            rows = table.find_all('tr')
            current_year = None
            
            for row in rows:
                cells = row.find_all(['td', 'th'])
                
                for cell in cells:
                    text = cell.get_text(strip=True)
                    
                    # Check if this cell contains a year
                    if re.match(r'^\d{4}$', text):
                        current_year = text
                    
                    # Find week links within this cell
                    for link in cell.find_all('a', href=True):
                        link_text = link.get_text(strip=True)
                        href = link['href']
                        
                        # Match patterns like "1st", "2nd", "3rd", etc.
                        if re.match(r'^\d+(st|nd|rd|th)$', link_text):
                            absolute_url = urljoin(page_url, href)
                            
                            # Extract week number
                            week_match = re.match(r'^(\d+)', link_text)
                            week_num = week_match.group(1) if week_match else link_text
                            
                            # Create descriptive name with year if available
                            if current_year:
                                display_name = f"{current_year}_week_{week_num.zfill(2) if week_num.isdigit() else week_num}"
                            else:
                                display_name = f"week_{link_text}"
                            
                            weekly_links.append((absolute_url, display_name, current_year, link_text))
        
        return weekly_links
    
    def convert_google_drive_link(self, url):
        """
        Convert Google Drive view/preview links to direct download links.
        
        Args:
            url: Google Drive URL
            
        Returns:
            Direct download URL
        """
        # Extract file ID from various Google Drive URL formats
        file_id = None
        
        # Format: https://drive.google.com/file/d/{FILE_ID}/view
        match = re.search(r'/file/d/([a-zA-Z0-9_-]+)', url)
        if match:
            file_id = match.group(1)
        
        # Format: https://drive.google.com/open?id={FILE_ID}
        if not file_id:
            match = re.search(r'[?&]id=([a-zA-Z0-9_-]+)', url)
            if match:
                file_id = match.group(1)
        
        # Format: https://docs.google.com/document/d/{FILE_ID}
        if not file_id:
            match = re.search(r'/document/d/([a-zA-Z0-9_-]+)', url)
            if match:
                file_id = match.group(1)
        
        # If we found a file ID, convert to direct download link
        if file_id:
            return f"https://drive.google.com/uc?export=download&id={file_id}"
        
        # Return original URL if we couldn't parse it
        return url
    
    def sanitize_filename(self, filename):
        """
        Clean filename to be filesystem-safe.
        
        Args:
            filename: Original filename
            
        Returns:
            Sanitized filename
        """
        # Remove or replace invalid characters
        filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
        filename = re.sub(r'\s+', '_', filename)
        filename = filename[:200]  # Limit length
        
        # Ensure it has .pdf extension
        if not filename.lower().endswith('.pdf'):
            filename += '.pdf'
            
        return filename
    
    def extract_name_from_url(self, url):
        """
        Extract a meaningful name from URL.
        
        Args:
            url: URL string
            
        Returns:
            Extracted name
        """
        parsed = urlparse(url)
        
        # Check for filename in path
        path_parts = parsed.path.split('/')
        if path_parts[-1]:
            name = path_parts[-1]
            if not name.lower().endswith('.pdf'):
                name += '.pdf'
            return name
        
        # Check query parameters
        if 'lid=' in parsed.query:
            lid_match = re.search(r'lid=(\d+)', parsed.query)
            if lid_match:
                return f"document_{lid_match.group(1)}.pdf"
        
        # Fallback
        return f"document_{hash(url) % 100000}.pdf"
    
    def download_from_google_drive(self, url, filepath):
        """
        Download a file from Google Drive, handling the confirmation page.
        
        Args:
            url: Google Drive URL
            filepath: Path to save the file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Initial request
            response = self.session.get(url, stream=True, timeout=30)
            
            # Check if we got a confirmation page (for large files)
            if 'confirm=' in response.url or 'download_warning' in response.text:
                # Extract confirmation token
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Look for the download link with confirmation
                for link in soup.find_all('a'):
                    href = link.get('href', '')
                    if 'confirm=' in href or 'download' in href:
                        # Make the actual download request
                        download_url = urljoin(response.url, href)
                        response = self.session.get(download_url, stream=True, timeout=30)
                        break
                
                # Alternative: look for confirm token in cookies
                if 'confirm=' not in response.url:
                    for key, value in response.cookies.items():
                        if key.startswith('download_warning'):
                            url_with_confirm = f"{url}&confirm={value}"
                            response = self.session.get(url_with_confirm, stream=True, timeout=30)
                            break
            
            # Download the file in chunks
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            
            # Check if we actually got a PDF
            if filepath.stat().st_size < 1000:
                # File too small, probably an error page
                filepath.unlink()
                logger.warning(f"Downloaded file from {url} is too small, likely not a PDF")
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to download from Google Drive {url}: {e}")
            if filepath.exists():
                filepath.unlink()
            return False
    
    def download_pdf(self, url, filename):
        """
        Download a single PDF file, including from Google Drive.
        
        Args:
            url: PDF URL
            filename: Output filename
            
        Returns:
            True if successful, False otherwise
        """
        filepath = self.output_dir / filename
        
        # Skip if already downloaded
        if filepath.exists():
            logger.info(f"Skipping {filename} - already exists")
            self.skipped_count += 1
            return True
        
        try:
            # For Google Drive links, we may need to handle the confirmation page
            if 'drive.google.com' in url:
                response = self.download_from_google_drive(url, filepath)
                if response:
                    file_size = filepath.stat().st_size / 1024  # KB
                    logger.info(f"Downloaded {filename} ({file_size:.2f} KB)")
                    self.downloaded_count += 1
                    time.sleep(1)
                    return True
                else:
                    self.failed_count += 1
                    return False
            
            # Regular download for non-Google Drive links
            response = self.get_page_content(url)
            if not response:
                self.failed_count += 1
                return False
            
            # Check if content is actually a PDF
            content_type = response.headers.get('Content-Type', '')
            if 'pdf' not in content_type.lower() and len(response.content) < 1000:
                logger.warning(f"URL {url} doesn't seem to contain a valid PDF")
                self.failed_count += 1
                return False
            
            # Save the PDF
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            file_size = len(response.content) / 1024  # KB
            logger.info(f"Downloaded {filename} ({file_size:.2f} KB)")
            self.downloaded_count += 1
            
            # Be polite - add delay between downloads
            time.sleep(1)
            return True
            
        except Exception as e:
            logger.error(f"Failed to download {url}: {e}")
            self.failed_count += 1
            return False
    
    def scrape_and_download(self):
        """
        Main method to scrape the website and download all PDFs.
        """
        logger.info(f"Starting PDF download from {self.base_url}")
        logger.info(f"Output directory: {self.output_dir.absolute()}")
        
        # Step 1: Get the main page
        response = self.get_page_content(self.base_url)
        if not response:
            logger.error("Failed to fetch main page. Aborting.")
            return
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Step 2: Extract direct PDF links from main page
        logger.info("Extracting PDF links from main page...")
        pdf_links = self.extract_pdf_links(soup, self.base_url)
        logger.info(f"Found {len(pdf_links)} direct PDF links")
        
        # Step 3: Extract weekly links
        logger.info("Extracting weekly outbreak links...")
        weekly_links = self.extract_weekly_links(soup, self.base_url)
        logger.info(f"Found {len(weekly_links)} weekly links")
        if self.scanned_urls:
            logger.info(f"Resuming - {len(self.scanned_urls)} pages already scanned")
        
        # Step 4: Visit each weekly page and extract PDFs
        all_pdf_links = list(pdf_links)  # Start with direct links
        
        try:
            for week_url, display_name, year, week_text in tqdm(weekly_links, desc="Scanning weekly pages"):
                # Skip if already scanned
                if week_url in self.scanned_urls:
                    continue
                    
                response = self.get_page_content(week_url)
                if response:
                    week_soup = BeautifulSoup(response.content, 'html.parser')
                    week_pdfs = self.extract_pdf_links(week_soup, week_url)
                    
                    if week_pdfs:
                        # Add week identifier to filename
                        for pdf_url, pdf_name in week_pdfs:
                            # Prepend year and week to filename for organization
                            base_name = pdf_name.replace('.pdf', '')
                            new_name = f"{display_name}_{base_name}.pdf"
                            all_pdf_links.append((pdf_url, new_name))
                        
                        logger.info(f"Found {len(week_pdfs)} PDFs in {display_name} ({week_text})")
                    
                    # Mark as scanned
                    self.scanned_urls.add(week_url)
                    
                    # Save progress periodically
                    if len(self.scanned_urls) % 50 == 0:
                        self.save_progress(self.scanned_urls)
                    
                    time.sleep(0.5)  # Small delay between page requests
        except KeyboardInterrupt:
            logger.warning("\nInterrupted! Saving progress...")
            self.save_progress(self.scanned_urls)
            logger.info(f"Progress saved. Scanned {len(self.scanned_urls)} pages. Run again to resume.")
            return
        
        # Save final progress
        self.save_progress(self.scanned_urls)
        
        # Remove duplicates based on URL
        unique_pdfs = {}
        for url, name in all_pdf_links:
            if url not in unique_pdfs:
                unique_pdfs[url] = name
        
        logger.info(f"Total unique PDFs to download: {len(unique_pdfs)}")
        
        # Step 5: Download all PDFs
        for pdf_url, pdf_name in tqdm(unique_pdfs.items(), desc="Downloading PDFs"):
            self.download_pdf(pdf_url, pdf_name)
        
        # Summary
        logger.info("=" * 60)
        logger.info("Download Summary:")
        logger.info(f"  Successfully downloaded: {self.downloaded_count}")
        logger.info(f"  Already existed (skipped): {self.skipped_count}")
        logger.info(f"  Failed: {self.failed_count}")
        logger.info(f"  Total processed: {len(unique_pdfs)}")
        logger.info(f"  Output directory: {self.output_dir.absolute()}")
        logger.info("=" * 60)


def main():
    """Main entry point."""
    # IDSP Weekly Outbreaks page
    url = "https://idsp.mohfw.gov.in/index4.php?lang=1&level=0&linkid=406&lid=3689"
    
    # Initialize downloader
    downloader = IDSPPDFDownloader(
        base_url=url,
        output_dir='../data/raw/idsp_pdfs'
    )
    
    # Start scraping and downloading
    downloader.scrape_and_download()


if __name__ == '__main__':
    main()
