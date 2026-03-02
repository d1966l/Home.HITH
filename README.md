# Home.HITH

Streamlining the collection of data, manipulation and documentation process for HITH clinicians.

## Overview

This repository contains the automation solution for the **NSLHD HITH** (Hospital in the Home) program. It processes intake and CFS PDFs, writes fields to Excel, merges records by MRN, populates the Liaison Admit template, and saves the output documents to SharePoint.

## Repository Structure

```text
.
├── .gitignore
├── LICENSE
├── README.md
├── Data/
│   └── form-data.xlsx
├── Liaison/
│   ├── HL-Admit-Mapped-Namespaced.xml
│   ├── Liaison Admit Template.docx
│   └── Liaison Admit Template.dotx
├── docs/
│   └── structure.md
└── packages/
    ├── README.md
    ├── manifest.json
    ├── flow-definition.json
    ├── Sharepoint Drive.xml
    ├── CFS_data_unmasked_dataverse.csv
    ├── flows/
    │   ├── parent.flow.json
    │   └── child.flow.json
    ├── office-scripts/
    │   └── Add_Admin_Columns_tbl_doc_data.ts
    ├── CFS-AI/
    │   ├── (sample CFS PDFs...)
    │   └── CFS_data_unmasked_dataverse.csv
    └── Intake-AI/
        └── (sample Intake PDFs...)
```

## Getting Started

See [`packages/README.md`](packages/README.md) for import and configuration instructions.

For a detailed description of the repository layout, see [`docs/structure.md`](docs/structure.md).

## License

[MIT](LICENSE)

