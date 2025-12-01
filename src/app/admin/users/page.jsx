"use client";
import { getAllUsers } from "@/forntend/admin/services/userServices";
import { formatDate } from "@/forntend/common/commonDateFormat";
import CommonTable from "@/forntend/common/CommonTable";
import Pagination from "@/forntend/common/Pagination";
import React, { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";

const page = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    limit: 8,
    totalPages: 1,
  });

  const fetchAllUsers = async (page = 1) => {
    const response = await getAllUsers(search, page, pagination.limit);

    if (response) {
      setUsers(response.data);
      setPagination(response.pagination);
    }
  };

  useEffect(() => {
    fetchAllUsers(1);
  }, [search]);

  return (
    <>
      <div className="mb-4 pt-5 sm:pt-10 px-5">
        <div className="sm:flex justify-between items-center w-full">
          <div className="pb-2 font-bold text-gray-500 w-full text-2xl">
            Users
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg w-full  lg:w-1/2 px-3 h-10 ">
            <div className="pe-1">
              <RiSearchLine className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full  outline-none text-gray-600"
            />
          </div>
        </div>
      </div>
      <div className="max-h-[calc(100vh-320px)]  sm:max-h-[calc(100vh-280px)] overflow-auto">
        <CommonTable
          columns={[
            { key: "id", title: "#" },
            { key: "userName", title: "User Name" },
            { key: "email", title: "Email" },
            { key: "login_type", title: "Status" },
            { key: "login_type", title: "Login Type" },
            { key: "createdAt", title: "Created Date" },
          ]}
        >
          {users.map((user, index) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 border-b text-gray-500 border-gray-300"
            >
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4">{user.userName}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                {" "}
                <span class="relative inline-block px-3 py-1 font-semibold text-borwn-800 leading-tight">
                  <span
                    aria-hidden
                    class="absolute inset-0 bg-brown-500 opacity-50 rounded-full"
                  ></span>
                  <span class="relative">Active</span>
                </span>
              </td>
              <td className="px-6 py-4">{user.login_type || "-"}</td>
              <td className="px-6 py-4">{formatDate(user.createdAt)}</td>
            </tr>
          ))}
        </CommonTable>
      </div>
      <Pagination
        pagination={{
          page: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          totalPages: pagination.totalPages,
          onPageChange: fetchAllUsers,
        }}
      />
    </>
  );
};

export default page;

// "use client";
// import { getAllUsers } from "@/forntend/admin/services/userServices";
// import CommonTable from "@/forntend/common/CommonTable";
// import Pagination from "@/forntend/common/Pagination";
// import React, { useEffect, useState } from "react";

// const jobs = [
//   {
//     id: 1,
//     title: "Back End Dev",
//     department: "Engineering",
//     type: "Full-time",
//     location: "Remote",
//   },
//   {
//     id: 2,
//     title: "Front End Dev",
//     department: "Engineering",
//     type: "Full-time",
//     location: "Remote",
//   },
//   {
//     id: 3,
//     title: "UI Designer",
//     department: "Design",
//     type: "Full-time",
//     location: "Remote",
//   },
// ];

// function JobsPage() {
//   const [search, setSearch] = useState("");
//   const [users, setUsers] = useState([]);
//   const [paginationdata, setPaginationdata] = useState({});

//   const filtered = jobs.filter((job) =>
//     job.title.toLowerCase().includes(search.toLowerCase())
//   );

//   useEffect(() => {
//     const fetchAllUsers = async () => {
//       const response = await getAllUsers({search : "", page : 2});
//       if (response) {
//         setUsers(response.data);
//         setPaginationdata(response.pagination);
//       }
//     };
//     fetchAllUsers();
//   }, []);
//   console.log(users);

//   return (
//     <>
//       <CommonTable
//         columns={[
//           { key: "id", title: "ID" },
//           { key: "title", title: "Title" },
//           { key: "department", title: "Department" },
//           { key: "type", title: "Type" },
//           { key: "location", title: "Location" },
//         ]}
//         onSearch={setSearch}
//       >
//         {filtered.map((job) => (
//           <tr
//             key={job.id}
//             className="hover:bg-gray-50 border-b text-gray-500 border-gray-300"
//           >
//             <td className="px-6 py-4">{job.id}</td>
//             <td className="px-6 py-4">{job.title}</td>
//             <td className="px-6 py-4">{job.department}</td>
//             <td className="px-6 py-4">{job.type}</td>
//             <td className="px-6 py-4">{job.location}</td>
//           </tr>
//         ))}
//       </CommonTable>
//       <Pagination
//         pagination={{
//           page: paginationdata.page,
//           pageSize: paginationdata.totalPages,
//           total: paginationdata.total,
//           onPageChange: 1,
//         }}
//       />
//     </>
//   );
// }

// export default JobsPage;
