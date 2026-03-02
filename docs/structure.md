# Repository Structure

This document describes the layout of the **Home.HITH** repository.

## Top-level

| Path | Description |
|------|-------------|
| `README.md` | Project overview and quick-start guide |
| `LICENSE` | MIT license |
| `.gitignore` | Files and directories excluded from version control |
| `Data/` | Source Excel workbook used by the automation |
| `Liaison/` | Word/XML templates for the Liaison Admit document |
| `packages/` | Deployable Power Automate solution and supporting assets |
| `docs/` | Project documentation |

## Data/

| File | Description |
|------|-------------|
| `form-data.xlsx` | Excel workbook containing `tbl_doc_data` – the table written to by the Power Automate flows |

## Liaison/

| File | Description |
|------|-------------|
| `HL-Admit-Mapped-Namespaced.xml` | XML field-mapping definition (53 fields) used to bind the Word template |
| `Liaison Admit Template.docx` | Word template populated by the child flow |
| `Liaison Admit Template.dotx` | Word template source (dotx format) |

## packages/

| Path | Description |
|------|-------------|
| `README.md` | Import and configuration guide for the Power Automate solution |
| `manifest.json` | Solution manifest |
| `flow-definition.json` | Combined flow definition export |
| `Sharepoint Drive.xml` | SharePoint drive mapping |
| `CFS_data_unmasked_dataverse.csv` | Sample CFS data (unmasked, for development use) |
| `flows/parent.flow.json` | Parent flow – SharePoint trigger, fetches file content, invokes child flow |
| `flows/child.flow.json` | Child flow v1.1 – AI extraction, Excel append, MRN merge, Word population, output save |
| `office-scripts/Add_Admin_Columns_tbl_doc_data.ts` | One-time Office Script to add `Source` and `LastUpdated` columns to `tbl_doc_data` |
| `CFS-AI/` | Sample CFS PDFs used for AI extraction testing |
| `Intake-AI/` | Sample Intake PDFs used for AI extraction testing |

## docs/

| File | Description |
|------|-------------|
| `structure.md` | This file – repository layout reference |
