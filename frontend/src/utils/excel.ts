import * as XLSX from 'xlsx';

export function exportToExcel<T extends Record<string, unknown>>(
    data: T[],
    columns: { key: keyof T; label: string }[],
    fileName: string = 'export'
) {
    const rows = data.map(item =>
        columns.reduce((acc, col) => {
            acc[col.label] = item[col.key] ?? '';
            return acc;
        }, {} as Record<string, unknown>)
    );

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}