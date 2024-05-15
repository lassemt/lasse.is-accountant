export function arrayToCsv(array, delimiter = ',') {
  return array.map((row) => {
    return row.map(column => {
      return isNaN(column) ? `"${column.replace(/"/g, '""')}"` : column;
    }).join(delimiter);
  }).join('\n');
}
