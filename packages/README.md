
# NSLHD.HITH.Liaison – Solution v1.1 (Parent + Child)
**Created:** 2026-02-25T03:51:12.958809Z

This solution processes **intake** and **cfs** PDFs, writes fields to Excel **tbl_doc_data**, auto‑merges the latest values for the same **MRN** (intake priority, then cfs), populates the **Liaison Admit** template, and **saves** the DOCX + PDF into **/GP Liaison/07 Intake to Admit/Output/**.

## Components
- **Environment Variables**: `Env_SiteUrl`, `Env_ScanningFolder`, `Env_ExcelPath`, `Env_ExcelTable`, `Env_WordPath`, `Env_OutputFolder`, `Env_FunctionUrl`, `Env_FunctionKey`.
- **Parent flow**: SharePoint trigger → Get file content → Run child flow.
- **Child flow v1.1**: HTTP (AI) → Append to Excel (adds `Source` & `LastUpdated`) → List MRN rows → Merge intake→cfs → Populate Word → Save DOCX + PDF to Output.

## Import
1. Power Automate → **Solutions** → **Import** → select this ZIP.
2. Map connections: **SharePoint**, **Excel Online (Business)**, **Word Online (Business)**, **HTTP**, **Child Flow Management**.
3. Set environment variables:
   - `Env_SiteUrl`: https://nswhealth.sharepoint.com/sites/NSLHDHITH-Resources
   - `Env_ScanningFolder`: /GP Liaison/07 Intake to Admit/Scanning
   - `Env_ExcelPath`: /GP Liaison/07 Intake to Admit/Data/form-data.xlsx
   - `Env_ExcelTable`: tbl_doc_data
   - `Env_WordPath`: /GP Liaison/07 Intake to Admit/Liaison/Liaison Admit Template.docx
   - `Env_OutputFolder`: /GP Liaison/07 Intake to Admit/Output/
   - `Env_FunctionUrl`: https://<yourapp>.azurewebsites.net/api/extract
   - `Env_FunctionKey`: <function-key>

## One‑time prep
- Ensure **tbl_doc_data** includes two columns: **Source**, **LastUpdated**.
  - If not, open **form-data.xlsx** and run the included Office Script once: `office-scripts/Add_Admin_Columns_tbl_doc_data.ts`.
- Confirm your Word template fields match your XML map field names (53 fields).

## Notes
- Merge logic: for each field we use `intake` value first, then fallback to `cfs`.
- The flow generates the Liaison document **only when both** intake and cfs are present for the **same MRN**.
- File names: `yyyyMMdd-HHmmss_MRN_Liaison.docx/.pdf` in the Output folder.
