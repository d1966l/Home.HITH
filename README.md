# Home.HITH
Streamlining the collection of data, manipulation and documentation process for HITH clinicians.

# Home‑HITH

**Purpose.** This repository hosts operational and clinical artefacts for Hospital‑in‑the‑Home (HITH) work: raw inputs, generated outputs, shared datasets, liaison materials, and packaged releases. It also includes SOP-style documentation and light automation to keep the repository clean and repeatable.

## Folder map
- **01-Input/** – Raw inbound material (read‑only; never edited in place)
- **02-Output/** – Generated artefacts (reports, exports, dashboards)
- **03-Data/** – Shared/reference datasets used across workstreams (optional)
- **Liaison/** – Stakeholder communications, meeting notes, rosters/run‑sheets
- **Package/** – Release bundles ready to share (ZIP/PDF packs)
- **Temp/** – Scratch/working files (the *folder* is tracked; its *contents* are ignored)
- **docs/** – SOPs and documentation (see `docs/structure.md`)
- **scripts/** – Repeatable automation (ETL, validation, packaging)
- **.github/workflows/** – CI checks for repo hygiene

> Tip: If you need a visible source folder, prefer `src/` (avoid leading dots like `.src/` unless it’s intentionally hidden).

## Conventions
- **Immutable inputs:** Don’t modify files inside `01-Input/`. Transformations should write to `02-Output/`.
- **Outputs only:** Reports/exports go to `02-Output/` (not `01-Input/` or `03-Data/`).
- **Scratch safely:** Put temporary/intermediate files in `Temp/`. Contents are git‑ignored.
- **Naming:** Use ISO dates (`YYYY-MM-DD`) in filenames and release pack folders.
- **Packs:** Use `Package/YYYY-MM-DD_Home-HITH_Pack/` with subfolders `Reports/`, `Data/`, `Docs/`, plus an optional `Checksums.txt`.

## Quick start
1. **Clone** and open in VS Code.  
2. **Add** any SOPs or data notes under `docs/`.  
3. **Run CI**: push a branch or open a PR — GitHub Actions will check structure, large files, and simple secret patterns.

## Documentation
- `docs/structure.md` — what belongs in each folder, with examples.
- Add service‑specific SOPs under `docs/` as needed (e.g., intake workflow, antimicrobial therapy pack build).

## Security & privacy
- Do **not** commit credentials or patient‑identifiable data.
- Use `.env` files for local secrets (see `.gitignore`), and GitHub **Secrets** for Actions.

## Roadmap
- Optional: add `scripts/make_pack.(ps1|sh)` to assemble a release pack automatically.
- Optional: markdown linting or docs publishing workflow (MkDocs or similar).

---

*Maintainers:* add `CODEOWNERS` and `SECURITY.md` when governance is defined.

structure.md
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
└── packages/
    ├── README.md
    ├── manifest.json
    ├── flow-definition.json
    ├── Sharepoint Drive.xml
    ├─��� CFS_data_unmasked_dataverse.csv
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
