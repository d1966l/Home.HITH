# Repository structure

This document describes the layout of the Home.HITH repository.

## Tree

```
Home.HITH/
├── .gitignore                          # Git ignore rules
├── .github/
│   └── workflows/
│       └── ci.yml                      # Markdown lint CI workflow
├── LICENSE                             # Licence file
├── README.md                           # Project overview (start here)
├── src                                 # Placeholder – reserved for future source code
│
├── Data/
│   └── form-data.xlsx                  # Excel workbook; tbl_doc_data is the main table
│
├── Liaison/
│   ├── HL-Admit-Mapped-Namespaced.xml  # XML data-binding map (53 fields) for the Word template
│   ├── Liaison Admit Template.docx     # Word template populated by the child flow
│   └── Liaison Admit Template.dotx    # Word template master (dotx format)
│
├── docs/
│   └── structure.md                    # This file
│
└── packages/
    ├── README.md                       # Full import and setup instructions
    ├── manifest.json                   # Solution metadata and environment variable defaults
    ├── flow-definition.json            # Combined flow definition export
    ├── Sharepoint Drive.xml            # SharePoint drive/connection descriptor
    ├── CFS_data_unmasked_dataverse.csv # CFS extraction results (unmasked – see warning below)
    │
    ├── flows/
    │   ├── parent.flow.json            # Parent flow: SharePoint trigger → invoke child
    │   └── child.flow.json             # Child flow v1.1: AI extract → Excel → Word → save
    │
    ├── office-scripts/
    │   └── Add_Admin_Columns_tbl_doc_data.ts
    │                                   # Office Script: adds Source & LastUpdated columns
    │                                   # to tbl_doc_data (run once after initial Excel setup)
    │
    ├── CFS-AI/
    │   ├── CFS_data_unmasked_dataverse.csv   # CFS extraction results
    │   └── *.pdf                             # Sample CFS PDFs for AI extraction testing
    │                                         # (see sensitive-data note below)
    │
    └── Intake-AI/
        └── *.pdf                             # Sample Intake PDFs for AI extraction testing
                                              # (see sensitive-data note below)
```

> **Note on `office-scripts/`**: the scripts listed above reflect the current state of the branch.
> The listing may change as new scripts are added.
> Browse the [`packages/office-scripts/`](../packages/office-scripts/) directory on GitHub for the latest files.

## Top-level directories

### `Data/`

Contains the Excel workbook that acts as the solution's data store.
`tbl_doc_data` is the structured table that both flows read from and write to.
The table requires `Source` and `LastUpdated` columns (added by the Office Script on first run).

### `Liaison/`

Templates and XML mapping used to generate the final Liaison Admit document:

- **`HL-Admit-Mapped-Namespaced.xml`** — XML data-binding map that links 53 named fields in the Word template to data extracted from PDFs.
- **`Liaison Admit Template.docx` / `.dotx`** — the Word template populated by the child flow.

### `packages/`

The importable Power Automate solution package and all associated assets.
See [`packages/README.md`](../packages/README.md) for step-by-step import instructions.

Key files:

| File | Purpose |
|------|---------|
| `manifest.json` | Solution name, version, and default environment variable values |
| `flow-definition.json` | Full combined flow export (used for import into Power Automate) |
| `Sharepoint Drive.xml` | SharePoint connection/drive descriptor |
| `flows/parent.flow.json` | Parent flow definition |
| `flows/child.flow.json` | Child flow definition (AI + Excel + Word logic) |

### `packages/CFS-AI/` and `packages/Intake-AI/`

Sample PDF documents used to test the AI extraction function.

> ⚠️ **Sensitive data warning**: some PDFs in these directories may contain patient-identifiable
> information (names, MRNs, dates of birth).  
> Before committing new samples, de-identify all patient data.  
> Use `CFS DEIDENTIFIED Name NB PAT.pdf` as a model for how a de-identified file should look.  
> Never commit real patient data to a public repository.

### `docs/`

Project documentation (this directory).

| File | Purpose |
|------|---------|
| `structure.md` | This file — repository layout and directory explanations |
