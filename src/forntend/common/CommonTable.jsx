"use client";
import React from "react";

function CommonTable({ columns = [], children, minWidth = null }) {
  // Determine the number of columns to correctly span the 'No Data' message
  const colSpan = columns.length > 0 ? columns.length : 1;

  // Use a sensible default min-width if none is provided
  const tableMinWidth = minWidth || "min-w-[1000px]";

  return (
    <div className="py-4 w-full overflow-x-auto">
      {/* Table Container */}
      <div className="min-w-full shadow rounded-lg ">
        <table className={`w-full overflow-x-auto ${tableMinWidth} bg-white`}>
          {/* Table Header (Thead) */}
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 ${(React.Children.count(children) !== 0) ? "border-b" : "border"} border-gray-300 text-left text-bold tracking-wider`}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {children}

            {/* Conditional Rendering for "No Data Found" */}
            {(!children || React.Children.count(children) === 0) && (
              <tr className="w-full">
                <td
                  colSpan={colSpan}
                  className="px-6 py-10 border border-gray-200 text-center text-gray-500 text-lg"
                >
                No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CommonTable;
// "use client";
// import React from "react";

// function CommonTable({ columns = [], children, minWidth = null }) {
//   console.log("childert===", children);

//   return (
//     <div className="py-4 w-full overflow-x-auto">
//       {/* Table Container */}
//       <div className="min-w-full shadow rounded-lg ">
//         <table
//           className={`w-full overflow-x-auto ${
//             minWidth ? minWidth : "min-w-[1000px]"
//           } bg-white`}
//         >
//           <thead>
//             <tr>
//               {columns.map((col) => (
//                 <th
//                   key={col.key}
//                   className="px-6 py-3 border-b border-gray-300 text-left  text-bold  tracking-wider"
//                 >
//                   {col.title}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>{children}</tbody>
//           { !children && }
//         </table>
//       </div>
//     </div>
//   );
// }

// export default CommonTable;
