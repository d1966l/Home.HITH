# Home.HITH

> Streamlining the collection of data, manipulation, and documentation process for HITH clinicians.

## Purpose

Home.HITH automates the end-to-end **Hospital-in-the-Home (HITH)** intake and liaison workflow for NSLHD.
A Power Automate solution watches a SharePoint scanning folder, uses an AI function to extract structured data from uploaded PDFs (intake forms and clinical-function summaries), merges the results per patient MRN, and populates a Liaison Admit Word template — saving both DOCX and PDF outputs automatically.

## High-level architecture

```
SharePoint Scanning Folder
        │  (new PDF uploaded)
        ▼
  Parent Flow (trigger)
        │  passes file content
        ▼
  Child Flow v1.1
    ├─ HTTP → Azure Function (AI extraction)
    ├─ Append row to Excel tbl_doc_data (form-data.xlsx)
    ├─ List all rows for same MRN
    ├─ Merge: intake values first, cfs fallback
    ├─ Populate Word template (Liaison Admit Template.docx)
    └─ Save DOCX + PDF → /GP Liaison/07 Intake to Admit/Output/
```

## Repository structure

See [`docs/structure.md`](docs/structure.md) for a full tree and explanation of every top-level directory and key file.

| Path | Description |
|------|-------------|
| `Data/` | Excel workbook (`form-data.xlsx`) used as the data store |
| `Liaison/` | Word/XML templates for the Liaison Admit document |
| `packages/` | Importable Power Automate solution and supporting assets |
| `packages/CFS-AI/` | Sample CFS PDFs used for AI extraction testing |
| `packages/Intake-AI/` | Sample Intake PDFs used for AI extraction testing |
| `packages/office-scripts/` | TypeScript Office Script to add required table columns |
| `src` | Placeholder (reserved for future source code) |

## Quick start — importing the Power Automate solution

1. **Download** the solution package from `packages/` (or build a ZIP from `manifest.json` + the flow JSON files).
2. In **Power Automate** → **Solutions** → **Import** → select the solution ZIP.
3. **Map connections** when prompted:
   - SharePoint
   - Excel Online (Business)
   - Word Online (Business)
   - HTTP
   - Child Flow Management
4. **Set environment variables** (see [Environment variables](#environment-variables) below).
5. **One-time prep**: open `Data/form-data.xlsx` and run the Office Script once to ensure `tbl_doc_data` has the required `Source` and `LastUpdated` columns:
   - In Excel Online → **Automate** tab → run `Add_Admin_Columns_tbl_doc_data.ts`.
6. Confirm the Word template field names match the XML map (53 fields defined in `Liaison/HL-Admit-Mapped-Namespaced.xml`).
7. Upload a test PDF to the SharePoint scanning folder and verify the output appears in `/GP Liaison/07 Intake to Admit/Output/`.

For full import details see [`packages/README.md`](packages/README.md).

## Environment variables

These must be set in the imported Power Automate solution:

| Variable | Example / description |
|----------|-----------------------|
| `Env_SiteUrl` | `https://nswhealth.sharepoint.com/sites/NSLHDHITH-Resources` |
| `Env_ScanningFolder` | `/GP Liaison/07 Intake to Admit/Scanning` |
| `Env_ExcelPath` | `/GP Liaison/07 Intake to Admit/Data/form-data.xlsx` |
| `Env_ExcelTable` | `tbl_doc_data` |
| `Env_WordPath` | `/GP Liaison/07 Intake to Admit/Liaison/Liaison Admit Template.docx` |
| `Env_OutputFolder` | `/GP Liaison/07 Intake to Admit/Output/` |
| `Env_FunctionUrl` | `https://<yourapp>.azurewebsites.net/api/extract` |
| `Env_FunctionKey` | `<your-azure-function-key>` |

## Sensitive data and de-identification

> ⚠️ **Important — patient data notice**

Several sample PDFs committed under `packages/CFS-AI/` and `packages/Intake-AI/` may contain patient-identifiable information.
**Before adding new samples:**

- Remove or redact all real patient names, dates of birth, MRNs, and clinician details.
- Prefer using the already-de-identified file `packages/CFS-AI/CFS DEIDENTIFIED Name NB PAT.pdf` as a model.
- Use a PDF redaction tool (e.g., Adobe Acrobat, `qpdf`, or similar) to permanently remove metadata and visible PHI.
- Never commit real patient data to a public repository.

New binary artifacts (PDFs, DOCX, XLSX) that are not test fixtures should be kept outside the repository (e.g., on SharePoint) and referenced by path only.

## Contributing

1. Fork and create a feature branch.
2. Follow the de-identification guidance above for any sample files.
3. Open a pull request — CI will run basic markdown linting automatically.

## License

See [LICENSE](LICENSE).
