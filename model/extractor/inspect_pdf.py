import pdfplumber
import sys

pdf_path = sys.argv[1] if len(sys.argv) > 1 else '../data/raw/idsp_pdfs_all/1st_wk12.pdf'

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}")
    
    # Check each page for the data table
    for page_num, page in enumerate(pdf.pages[:3]):  # Check first 3 pages
        print(f"\n\n========== PAGE {page_num} ==========")
        tables = page.extract_tables()
        print(f"Tables on page: {len(tables)}")
        
        for table_idx, table in enumerate(tables):
            print(f"\n=== TABLE {table_idx} === ({len(table)} rows)")
            
            # Find header row with the disease outbreak fields
            for i, row in enumerate(table[:15]):
                if row and any(cell and ('Disease' in str(cell) or 'Illness' in str(cell)) for cell in row):
                    print(f"\n*** FOUND DATA TABLE AT ROW {i} ***")
                    print("Header:", row)
                    if i+1 < len(table):
                        print("Data row:", table[i+1])
                    break
