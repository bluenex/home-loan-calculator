import React from "react";
import { useTable } from "react-table";

const Table = ({ defaultColumns, data }) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    // for table
    getTableProps,
    getTableBodyProps,
    headers,
    rows,
    prepareRow
  } = useTable({
    columns: defaultColumns,
    data: data
  });

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          <tr>
            {headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Table;
