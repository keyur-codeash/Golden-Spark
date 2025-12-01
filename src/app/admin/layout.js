"use client";

import Sidebar from "@/components/layout/sidebar/Sidebar";
import Navbar from "@/components/layout/navbar/Navbar";
import React, { useState, useRef } from "react";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuButtonRef = useRef(null);

  return (
    <div className="bg-[#ededf2] h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        menuButtonRef={menuButtonRef}
      />

      <div className="md:px-5 ">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          menuButtonRef={menuButtonRef}
        />

        <div className="px-3 sm:pe-0 sm:ps-5  md:ml-64 ">
          <div className="shadow-all bg-white rounded-xl h-[calc(100vh-120px)] overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// import Sidebar from "@/components/layout/sidebar/Sidebar";
// import React from "react";

// function layout() {
//   return (
//     <>
//       <h2>layout</h2>
//       <Sidebar />
//     </>
//   );
// }

// export default layout;
