"use client";
import React from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

function Pagination({ pagination }) {
  const totalPages = pagination.totalPages ?? 1;

  const getVisiblePages = () => {
    const total = totalPages;
    const current = pagination.page;
    const maxVisible = 5;

    if (total <= maxVisible) {
      return [...Array(total)].map((_, i) => i + 1);
    }

    let start = current - Math.floor(maxVisible / 2);
    let end = current + Math.floor(maxVisible / 2);

    if (start < 1) {
      start = 1;
      end = maxVisible;
    }

    if (end > total) {
      end = total;
      start = total - maxVisible + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (pagination.totalPages <= 1) {
    return false;
  }

  return (
    <div className="flex items-center justify-between px-4 pb-3 sm:px-6 pt-2">
      <div className="ms-auto sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {/* Showing results count */}
        <div>
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {(pagination.page - 1) * pagination.pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                pagination.page * pagination.pageSize,
                pagination.total
              )}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span> results
          </p>
        </div>

        {/* Page Buttons */}
        <nav
          aria-label="Pagination"
          className="isolate inline-flex -space-x-px rounded-md border border-gray-300"
        >
          {/* Prev */}
          <button
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-2 disabled:opacity-40"
          >
            <SlArrowLeft className="text-black text-sm cursor-pointer" />
          </button>

          {/* Visible Pages */}
          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => pagination.onPageChange(page)}
              className={`px-4 py-2 text-sm font-semibold border-gray-300 border-x ${
                pagination.page === page
                  ? "bg-brown-800 text-white"
                  : "text-gray-700 hover:bg-brown-400"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            disabled={pagination.page === totalPages}
            className="px-3 py-2 disabled:opacity-40 cursor-pointer"
          >
            <SlArrowRight className="text-black text-sm" />
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Pagination;

// "use client";
// import React from "react";
// import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

// function Pagination({ pagination }) {
//   const totalPages = pagination
//     ? Math.ceil(pagination.total / pagination.pageSize)
//     : 1;
//   const getVisiblePages = () => {
//     const total = totalPages;
//     const current = pagination.page;
//     const maxVisible = 5;

//     if (total <= maxVisible) {
//       return [...Array(total)].map((_, i) => i + 1);
//     }

//     let start = current - Math.floor(maxVisible / 2);
//     let end = current + Math.floor(maxVisible / 2);

//     if (start < 1) {
//       start = 1;
//       end = maxVisible;
//     }

//     if (end > total) {
//       end = total;
//       start = total - maxVisible + 1;
//     }

//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//   };

//   return (
//     <div className="flex items-center justify-between border-t border-white/10 px-4 pb-3 sm:px-6">
//       <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//         {/* Showing text */}
//         <div>
//           <p className="text-sm text-gray-600">
//             Showing{" "}
//             <span className="font-medium">
//               {(pagination.page - 1) * pagination.pageSize + 1}
//             </span>{" "}
//             to{" "}
//             <span className="font-medium">
//               {Math.min(
//                 pagination.page * pagination.pageSize,
//                 pagination.total
//               )}
//             </span>{" "}
//             of <span className="font-medium">{pagination.total}</span> results
//           </p>
//         </div>

//         {/* Page Buttons */}
//         <nav
//           aria-label="Pagination"
//           className="isolate inline-flex -space-x-px rounded-md border"
//         >
//           {/* Prev Button */}
//           <button
//             onClick={() => pagination.onPageChange(pagination.page - 1)}
//             disabled={pagination.page === 1}
//             className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 cursor-pointer disabled:opacity-40"
//           >
//             <SlArrowLeft className="text-black text-sm" />
//           </button>

//           {/* Dynamic Page Buttons (max 5 at a time) */}
//           {getVisiblePages().map((page, index) => (
//             <button
//               key={index}
//               onClick={() => pagination.onPageChange(page)}
//               className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold border-x cursor-pointer ${
//                 pagination.page === page
//                   ? "bg-brown-800 text-white"
//                   : "text-gray-700 hover:bg-brown-400"
//               }`}
//             >
//               {page}
//             </button>
//           ))}

//           {/* Next Button */}
//           <button
//             onClick={() => pagination.onPageChange(pagination.page + 1)}
//             disabled={pagination.page === totalPages}
//             className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 cursor-pointer disabled:opacity-40"
//           >
//             <SlArrowRight className="text-black text-sm " />
//           </button>
//         </nav>
//       </div>
//     </div>
//   );
// }

// export default Pagination;
