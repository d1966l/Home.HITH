
// Name: Add_Admin_Columns_tbl_doc_data
export function main(workbook: ExcelScript.Workbook) {
  const tableName = "tbl_doc_data";
  const tbl = workbook.getTable(tableName);
  if (!tbl) throw new Error("Table tbl_doc_data not found");
  const headers = tbl.getHeaderRowRange().getValues()[0].map(v => String(v).trim());
  const mustHave = ["Source","LastUpdated"];
  const missing = mustHave.filter(h => !headers.includes(h));
  if (missing.length === 0) return;
  missing.forEach(name => tbl.addColumn(-1, { name, values: [] }));
}
