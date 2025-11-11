"""
Script to extract disease outbreak data from IDSP PDF files.

Extracts the following fields from each PDF:
- Unique ID
- Name of State/UT
- Name of District
- Disease/Illness
- No. of Cases
- No. of Deaths
- Date of Start of Outbreak
- Date of Reporting
- Current Status
- Comments/Action Taken

Saves the extracted data to a CSV file sorted by date.
"""

import os
import re
from pathlib import Path
import logging
import pandas as pd
import pdfplumber
from datetime import datetime
from tqdm import tqdm

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def clean_text(text):
    """Clean function to remove newlines and extra spaces."""
    if text is None:
        return ''
    text = str(text).replace('\n', ' ').replace('\r', ' ')
    text = ' '.join(text.split())  # Remove extra whitespace
    return text.strip()


def extract_table_data_from_pdf(pdf_path):
    """
    Extract disease outbreak data from a single PDF file.
    
    Returns a list of dictionaries, each representing a row of outbreak data.
    """
    records = []
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                # Extract tables from the page
                tables = page.extract_tables()
                
                for table in tables:
                    if not table or len(table) < 2:
                        continue
                    
                    # Check if this table has the outbreak data structure
                    # Look for header with "Disease" or "Illness" and "State"
                    has_disease_header = False
                    data_start_idx = 1
                    
                    first_row = table[0] if table else []
                    # Check if first row looks like a header
                    if first_row and len(first_row) >= 8:
                        row_text = ' '.join(str(cell or '') for cell in first_row)
                        if ('Disease' in row_text or 'Illness' in row_text) and 'State' in row_text:
                            has_disease_header = True
                            data_start_idx = 1
                    
                    # If not a data table, skip it
                    if not has_disease_header:
                        # Maybe the data continues from previous table without header
                        # Check if first row has data (10 columns with reasonable content)
                        if len(first_row) >= 8:
                            # Assume it's continuation data
                            data_start_idx = 0
                        else:
                            continue
                    
                    # Extract data rows
                    for row in table[data_start_idx:]:
                        if not row or len(row) < 8:
                            continue
                        
                        # Skip empty rows
                        if all(cell is None or str(cell).strip() == '' for cell in row):
                            continue
                        
                        # Skip header-like rows
                        row_text = clean_text(' '.join(str(cell or '') for cell in row))
                        if 'Name of State' in row_text or 'Disease/ Illness' in row_text:
                            continue
                        
                        # Extract fields - need to detect format
                        try:
                            # Check if row has standard 10-column format or 9-column format
                            # Strategy: Check if column 1 is empty/missing (indicates state might be merged with district)
                            col1 = clean_text(row[1]) if len(row) > 1 else ''
                            col2 = clean_text(row[2]) if len(row) > 2 else ''
                            col3 = clean_text(row[3]) if len(row) > 3 else ''
                            
                            # Detect format by checking if state column is present
                            # If col1 is empty and col2 looks like a state name (common Indian states)
                            indian_states = ['Andhra', 'Arunachal', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
                                           'Gujarat', 'Haryana', 'Himachal', 'Jharkhand', 'Karnataka', 'Kerala', 
                                           'Madhya', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
                                           'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil', 'Telangana', 
                                           'Tripura', 'Uttar', 'Uttarakhand', 'West', 'Delhi', 'Jammu', 'Ladakh']
                            
                            is_state_in_col2 = any(state in col2 for state in indian_states)
                            is_state_in_col1 = any(state in col1 for state in indian_states)
                            
                            # Determine format and extract accordingly
                            if not col1 and is_state_in_col2:
                                # Format B: No state column, state is in district field
                                # Shift columns left
                                record = {
                                    'unique_id': clean_text(row[0]) if len(row) > 0 else '',
                                    'state_ut': col2,  # State is in col2
                                    'district': col3,  # District is in col3
                                    'disease_illness': clean_text(row[4]) if len(row) > 4 else '',
                                    'num_cases': clean_text(row[5]) if len(row) > 5 else '0',
                                    'num_deaths': clean_text(row[6]) if len(row) > 6 else '0',
                                    'date_start_outbreak': clean_text(row[7]) if len(row) > 7 else '',
                                    'date_reporting': clean_text(row[8]) if len(row) > 8 else '',
                                    'current_status': clean_text(row[9]) if len(row) > 9 else '',
                                    'comments_action': clean_text(row[10]) if len(row) > 10 else '',
                                    'source_file': pdf_path.name
                                }
                            elif col1 and not col2 and not is_state_in_col1:
                                # Format: Sl.No | District (no state) | Disease | ...
                                record = {
                                    'unique_id': clean_text(row[0]) if len(row) > 0 else '',
                                    'state_ut': '',  # No state
                                    'district': col1,  # District is in col1
                                    'disease_illness': col2,  # Disease in col2
                                    'num_cases': col3,  # Cases in col3
                                    'num_deaths': clean_text(row[4]) if len(row) > 4 else '0',
                                    'date_start_outbreak': clean_text(row[5]) if len(row) > 5 else '',
                                    'date_reporting': clean_text(row[6]) if len(row) > 6 else '',
                                    'current_status': clean_text(row[7]) if len(row) > 7 else '',
                                    'comments_action': clean_text(row[8]) if len(row) > 8 else '',
                                    'source_file': pdf_path.name
                                }
                            else:
                                # Standard 10-column format
                                record = {
                                    'unique_id': clean_text(row[0]) if len(row) > 0 else '',
                                    'state_ut': col1,
                                    'district': col2,
                                    'disease_illness': col3,
                                    'num_cases': clean_text(row[4]) if len(row) > 4 else '0',
                                    'num_deaths': clean_text(row[5]) if len(row) > 5 else '0',
                                    'date_start_outbreak': clean_text(row[6]) if len(row) > 6 else '',
                                    'date_reporting': clean_text(row[7]) if len(row) > 7 else '',
                                    'current_status': clean_text(row[8]) if len(row) > 8 else '',
                                    'comments_action': clean_text(row[9]) if len(row) > 9 else '',
                                    'source_file': pdf_path.name
                                }
                            
                            # Only add if we have meaningful disease data
                            # Must have either state or district, and must have disease
                            if (record['state_ut'] or record['district']) and record['disease_illness']:
                                # Filter out obviously invalid rows
                                if len(record['disease_illness']) > 2:  # Disease name must be meaningful
                                    records.append(record)
                        except Exception as e:
                            logger.debug(f"Error parsing row in {pdf_path.name}: {e}")
                            continue
    
    except Exception as e:
        logger.error(f"Error processing {pdf_path.name}: {e}")
    
    return records


def parse_date(date_str):
    """
    Parse date string into a datetime object.
    Handles various date formats found in IDSP PDFs.
    """
    if not date_str or date_str.strip() == '':
        return None
    
    # Common date formats in IDSP PDFs
    date_formats = [
        '%d/%m/%Y',
        '%d-%m-%Y',
        '%d.%m.%Y',
        '%d/%m/%y',
        '%d-%m-%y',
        '%Y-%m-%d',
        '%d %B %Y',
        '%d %b %Y',
    ]
    
    for fmt in date_formats:
        try:
            return datetime.strptime(date_str.strip(), fmt)
        except:
            continue
    
    return None


def main():
    """Main entry point for disease data extraction."""
    pdf_folder = Path("../data/raw/idsp_pdfs_all")
    output_csv = Path("../data/processed/disease_outbreaks.csv")
    
    # Create output directory if it doesn't exist
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    
    logger.info(f"Starting extraction from: {pdf_folder}")
    
    # Get all PDF files
    pdf_files = list(pdf_folder.glob("*.pdf"))
    logger.info(f"Found {len(pdf_files)} PDF files to process")
    
    if not pdf_files:
        logger.warning("No PDF files found!")
        return
    
    # Extract data from all PDFs
    all_records = []
    
    for pdf_file in tqdm(pdf_files, desc="Processing PDFs"):
        records = extract_table_data_from_pdf(pdf_file)
        all_records.extend(records)
        
        if len(all_records) % 100 == 0:
            logger.info(f"Extracted {len(all_records)} records so far...")
    
    logger.info(f"Total records extracted: {len(all_records)}")
    
    if not all_records:
        logger.warning("No data extracted from PDFs!")
        return
    
    # Create DataFrame
    df = pd.DataFrame(all_records)
    
    # Parse dates for sorting
    df['parsed_date_start'] = df['date_start_outbreak'].apply(parse_date)
    df['parsed_date_reporting'] = df['date_reporting'].apply(parse_date)
    
    # Sort by date of start of outbreak (use reporting date as fallback)
    df['sort_date'] = df['parsed_date_start'].fillna(df['parsed_date_reporting'])
    df = df.sort_values('sort_date', ascending=True)
    
    # Drop the temporary parsing columns
    df = df.drop(['parsed_date_start', 'parsed_date_reporting', 'sort_date'], axis=1)
    
    # Save to CSV
    df.to_csv(output_csv, index=False, encoding='utf-8-sig')
    logger.info(f"Data saved to: {output_csv}")
    logger.info(f"Total records: {len(df)}")
    
    # Print summary statistics
    logger.info("\n=== Summary Statistics ===")
    logger.info(f"Unique States/UTs: {df['state_ut'].nunique()}")
    logger.info(f"Unique Districts: {df['district'].nunique()}")
    logger.info(f"Unique Diseases: {df['disease_illness'].nunique()}")
    logger.info(f"Total Cases: {pd.to_numeric(df['num_cases'], errors='coerce').sum()}")
    logger.info(f"Total Deaths: {pd.to_numeric(df['num_deaths'], errors='coerce').sum()}")
    

if __name__ == '__main__':
    main()
