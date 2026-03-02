# Home.HITH

Streamlining the collection of data, manipulation and documentation process for HITH clinicians.

---

## HITH Admit Processing — Power Automate Flow

This repository contains the Power Automate flow definition and Dataverse schema for the **HITH Admit Processing** automation. The flow monitors a SharePoint input folder, extracts patient data using a trained AI model, stores it in Dataverse, and populates the HL Admit Template document.

---

## Architecture Overview

```
SharePoint Input Folder (01-Input)
        │
        ▼
[Trigger] New/Modified File Detected
        │
        ▼
[Action] Get File Content from SharePoint
        │
        ▼
[Action] Process Document with HITH-OCR-model (AI Builder)
        │
        ▼
[Action] Chunk Extracted Key-Value Pairs
        │
        ▼
[Action] Save Chunks to Dataverse (hith_admitchunk table)
        │
        ▼
[Action] Read doc-data.xlsx (Key→Template Field Mapping)
        │
        ▼
[Action] Map AI Values to Word Template Content Controls
        │
        ▼
[Action] Populate HL Admit Template.docx (Word Online)
        │
        ▼
[Action] Save Completed Admit Document to SharePoint (Completed/)
        │
        ▼
[Action] Wait (flow idles until next file triggers the flow)
```

---

## SharePoint Paths

| Resource | Path |
|---|---|
| **Input folder** (monitored) | `/sites/NSLHDHITH-Resources/Operational Resources/GP Liaison/07 Home+HITH/01-Input` |
| **Liaison folder** | `/sites/NSLHDHITH-Resources/Operational Resources/GP Liaison/07 Home+HITH/Liaison` |
| **Admit Template** | `…/Liaison/HL Admit Template.docx` |
| **Key-Value Mapping** | `…/Liaison/doc-data.xlsx` |
| **Output folder** | `…/Liaison/Completed/` |

---

## Files in This Repository

| File | Description |
|---|---|
| `flows/hith-admit-processing.json` | Power Automate flow definition (import into Power Automate) |
| `dataverse/hith-admit-chunk-schema.json` | Dataverse table schema for the `hith_admitchunk` table |

---

## Prerequisites

Before importing and running the flow you need:

1. **Power Automate** (per-user or per-flow license that includes premium connectors).
2. **AI Builder** — the `HITH-OCR-model` custom document-processing model must already be trained and published in your Power Platform environment.
3. **Microsoft Dataverse** — the `hith_admitchunk` table must be created (see [Dataverse Setup](#dataverse-setup)).
4. **SharePoint** connections — the service account running the flow must have _Contribute_ permission on the site `NSLHDHITH-Resources`.
5. **Excel Online (Business)** connection — read access to `doc-data.xlsx`.
6. **Word Online (Business)** connection — the `HL Admit Template.docx` must have **content controls** whose tags match the template field names in Column B of `doc-data.xlsx`.

---

## doc-data.xlsx Format

`doc-data.xlsx` is a two-column mapping table (Table1) that links AI-extracted field names to Word content-control tags:

| Column A — AI Key | Column B — Template Tag |
|---|---|
| Patient Name | patientName |
| Date of Birth | dateOfBirth |
| Medicare Number | medicareNumber |
| Admitting Diagnosis | admittingDiagnosis |
| GP Name | gpName |
| … | … |

- **Column A** must exactly match (case-insensitive) the key text returned by `HITH-OCR-model`.
- **Column B** must exactly match the `Tag` property of the corresponding content control inside `HL Admit Template.docx`.

---

## Dataverse Setup

Create the `hith_admitchunk` table using the schema in `dataverse/hith-admit-chunk-schema.json`. The columns are:

| Logical Name | Display Name | Type | Notes |
|---|---|---|---|
| `hith_admitchunkid` | HITH Admit Chunk ID | Primary Key | Auto |
| `hith_sourcefile` | Source File Name | Text (500) | Name of uploaded document |
| `hith_sourcefileid` | Source File ID | Text (500) | SharePoint item ID |
| `hith_keytext` | Key Text | Text (1000) | OCR-extracted field label |
| `hith_valuetext` | Value Text | Multiline Text | OCR-extracted field value |
| `hith_confidence` | Confidence Score | Decimal (0–1) | AI confidence |
| `hith_chunkindex` | Chunk Index | Whole Number | Position in document |
| `hith_processedat` | Processed At | Date/Time | UTC timestamp |
| `hith_admitdocumenturl` | Admit Document URL | URL | Link to generated admit doc |
| `hith_processstatus` | Process Status | Option Set | Pending/Processing/Completed/Failed |

---

## Importing the Flow

1. Open [Power Automate](https://make.powerautomate.com) and select your target environment.
2. Go to **My flows → Import → Import Package (Legacy)**.
3. Upload `flows/hith-admit-processing.json`.
4. Map all connection references:
   - `hith_sharepointonline` → your SharePoint connection
   - `hith_aibuilder` → your AI Builder connection
   - `hith_commondataservice` → your Dataverse connection
   - `hith_excelonlinebusiness` → your Excel Online (Business) connection
   - `hith_wordonlinebusiness` → your Word Online (Business) connection
5. Click **Import** and then **Turn on** the flow.

---

## Flow Parameters

All configurable values are stored as flow parameters and can be updated without editing actions:

| Parameter | Default Value | Description |
|---|---|---|
| `SharePointSiteUrl` | `https://nslhd.sharepoint.com/sites/NSLHDHITH-Resources` | SharePoint site URL |
| `InputFolderPath` | `/Operational Resources/GP Liaison/07 Home+HITH/01-Input` | Monitored input folder |
| `LiaisonFolderPath` | `/Operational Resources/GP Liaison/07 Home+HITH/Liaison` | Folder containing template and mapping file |
| `AdmitTemplateName` | `HL Admit Template.docx` | Word template file name |
| `DocDataFileName` | `doc-data.xlsx` | Key-value mapping file name |
| `AIModelName` | `HITH-OCR-model` | AI Builder model name |
| `DataverseTableName` | `hith_admitchunks` | Dataverse table logical name |

---

## Flow Steps (Detail)

### 1 — Trigger: When a file is created or modified
Polls the `01-Input` SharePoint folder every minute. Fires once per new or updated file.

### 2 — Get file content
Retrieves the binary content of the uploaded document (PDF, DOCX, or image) from SharePoint.

### 3 — Process document with HITH-OCR-model
Submits the document to the AI Builder custom model `HITH-OCR-model`. The model returns a structured JSON response containing extracted key-value pairs, page text, and confidence scores.

### 4 — Chunk key-value pairs
Iterates over all extracted key-value pairs and builds an array of chunk objects, each containing:
- `sourceFile`, `sourceFileId` — document provenance
- `keyText`, `valueText` — extracted field name and value
- `confidence` — model confidence score
- `processedAt` — UTC timestamp

### 5 — Save chunks to Dataverse
Creates one row per chunk in the `hith_admitchunk` Dataverse table, making the extracted data available for reporting, audit, and downstream AI/Copilot queries.

### 6 — Read doc-data.xlsx
Fetches all rows from Table1 in `doc-data.xlsx` to obtain the mapping from AI key names to Word template content-control tags.

### 7 — Map fields from doc-data
For every row in `doc-data.xlsx`, searches the chunk array for a matching key (case-insensitive) and builds a `TemplateFields` object keyed by the content-control tag name.

### 8 — Populate HL Admit Template
Uses the Word Online (Business) **Populate a Microsoft Word template** action to fill in all content controls in `HL Admit Template.docx` with the mapped values.

### 9 — Save completed admit document
Writes the populated document to the `Completed/` sub-folder under `Liaison` with a timestamped filename (`ADMIT-YYYYMMDD-HHmmss-<original>.docx`).

### 10 — Wait
A one-minute delay action follows the save, signalling that the flow has finished processing this file and is ready for the next trigger.

---

## Error Handling

- The flow does not include built-in error handling branches. After import, it is recommended to add a **Configure run after** setting on the `Wait_for_next_trigger` action to also run on failed or skipped prior steps, and to add a notification action (e.g. Teams adaptive card or email) that reports the failure and sets `hith_processstatus = 4` (Failed) for the affected rows.
- All Dataverse rows created during a failed run remain in status _Processing_ (value 2) and can be identified and cleaned up via a Dataverse view filtered on `hith_processstatus eq 2`.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Edit `flows/hith-admit-processing.json` or `dataverse/hith-admit-chunk-schema.json`.
3. Open a pull request describing the change.

