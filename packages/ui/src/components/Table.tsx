import type { ReactNode } from 'react';

export interface TableProps {
  headers: ReactNode[];
  rows: ReactNode[][];
}

export function Table({ headers, rows }: TableProps) {
  return (
    <table className="min-w-full divide-y divide-charcoal/10 text-left text-sm">
      <thead className="bg-ivory">
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col" className="px-4 py-3 font-semibold text-charcoal">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-charcoal/5 bg-white">
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-ivory">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="px-4 py-3 text-charcoal/80">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
