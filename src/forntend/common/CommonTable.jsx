"use client";
import React from "react";

function CommonTable({ columns = [], children, minWidth = null }) {
  return (
    <div className="py-4 w-full overflow-x-auto">
      {/* Table Container */}
      <div className="min-w-full shadow rounded-lg ">
        <table
          className={`w-full overflow-x-auto ${
            minWidth ? minWidth : "min-w-[1000px]"
          } bg-white`}
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 border-b border-gray-300 text-left  text-bold  tracking-wider"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export default CommonTable;
