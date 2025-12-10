"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { AiOutlineProduct } from "react-icons/ai";
import { usePathname } from "next/navigation";

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  menuButtonRef,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeItem, setActiveItem] = useState(0);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const sidebarRef = useRef(null);
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Users",
      icon: <LuUsers />,
      link: "/admin/users",
      submenu: [],
    },
    {
      title: "Products",
      icon: <AiOutlineProduct />,
      link: "#",
      submenu: [
        { title: "Products", link: "/admin/products" },
        { title: "Categories", link: "/admin/products/categories" },
        { title: "Invoice", link: "#" },
      ],
    },
    {
      title: "Settings",
      icon: <LuUsers />,
      link: "#",
      submenu: [
        { title: "General", link: "#" },
        { title: "Privacy", link: "#" },
      ],
    },
  ];

  // Set active menu based on pathname
  useEffect(() => {
    let found = false;
    menuItems.forEach((item, index) => {
      if (item.link === pathname) {
        setActiveItem(index);
        setActiveSubmenu(null);
        found = true;
      } else if (item.submenu.length > 0) {
        item.submenu.forEach((sub, subIndex) => {
          if (sub.link === pathname) {
            setActiveItem(index);
            setActiveSubmenu(subIndex);
            setOpenDropdown(index);
            found = true;
          }
        });
      }
    });
    if (!found) {
      setActiveItem(0);
      setActiveSubmenu(null);
    }
  }, [pathname]);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleItemClick = (index) => {
    setActiveItem(index);
    if (menuItems[index].submenu.length === 0) {
      setActiveSubmenu(null);
    }
  };

  const handleSubmenuClick = (index, submenuIndex) => {
    setActiveSubmenu(submenuIndex);
    setActiveItem(index);
  };

  // Close sidebar if click is outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !menuButtonRef.current?.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="">
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-64 shadow-xl md:m-5 overflow-y-auto shadow-all h-[200px] min-h-screen md:min-h-[calc(100vh-35px)] rounded-xl bg-white border-0.5 border-yellow-50 transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0`}
      >
        <div className="">
          <div className="py-3 mx-auto relative h-20 w-full ">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              className="w-full lg:h-14 py-4 mx-auto"
              fill
            />
          </div>

          <ul className="space-y-2 font-medium">
            {menuItems.map((item, index) => (
              <li key={index} className="relative px-4 rounded">
                {activeItem === index && (
                  <span className="absolute right-0 top-0 bottom-0 after:content-[''] after:absolute after:right-0 after:top-0 !after:mx-10 after:bottom-0 after:border-r-1 after:border-3 after:rounded-l-full after:max-h-11 after:border-brown-800"></span>
                )}

                {/* MAIN LINK */}
                <Link
                  href={item.link}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors duration-300
                    ${
                      activeItem === index
                        ? "bg-brown-800 bg-opacity-20 hover:bg-brown-800 hover:bg-opacity-40 text-white"
                        : "text-black hover:bg-gray-100"
                    }`}
                  onClick={() => {
                    item.submenu.length > 0 && toggleDropdown(index);
                    handleItemClick(index);
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-lg">{item.icon}</span>
                    <span className="ml-3">{item.title}</span>
                  </div>

                  {item.submenu.length > 0 && (
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        openDropdown === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="m19 9-7 7-7-7"
                      />
                    </svg>
                  )}
                </Link>

                {/* SUBMENU */}
                {item.submenu.length > 0 && (
                  <ul
                    className={`pl-6 mt-1 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${
                      openDropdown === index ? "max-h-48" : "max-h-0"
                    }`}
                  >
                    {item.submenu.map((sub, i) => (
                      <li key={i}>
                        <Link
                          href={sub.link}
                          onClick={() => handleSubmenuClick(index, i)}
                          className={`block px-3 py-2 pl-4.5 mt-2.5 rounded-lg transition-colors
                            ${
                              activeSubmenu === i
                                ? "bg-brown-500 text-[#795741]"
                                : "text-black hover:bg-gray-200"
                            }`}
                        >
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useEffect, useRef, useState } from "react";
// import { LuUsers } from "react-icons/lu";
// import { AiOutlineProduct } from "react-icons/ai";

// export default function Sidebar({
//   isSidebarOpen,
//   setIsSidebarOpen,
//   menuButtonRef,
// }) {
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [activeItem, setActiveItem] = useState(0);
//   const [activeSubmenu, setActiveSubmenu] = useState(null);

//   const sidebarRef = useRef(null);

//   const menuItems = [
//     {
//       title: "Users",
//       icon: <LuUsers />,
//       link: "/admin/users",
//       submenu: [],
//     },
//     {
//       title: "Products",
//       icon: <AiOutlineProduct />,
//       link: "#",
//       submenu: [
//         { title: "Products", link: "/admin/products" },
//         { title: "Billing", link: "#" },
//         { title: "Invoice", link: "#" },
//       ],
//     },
//     {
//       title: "Settings",
//       icon: <LuUsers />,
//       link: "#",
//       submenu: [
//         { title: "General", link: "#" },
//         { title: "Privacy", link: "#" },
//       ],
//     },
//   ];

//   const toggleDropdown = (index) => {
//     setOpenDropdown(openDropdown === index ? null : index);
//   };

//   const handleItemClick = (index) => {
//     setActiveItem(index);
//     if (menuItems[index].submenu.length === 0) {
//       setActiveSubmenu(null);
//     }
//   };

//   const handleSubmenuClick = (index, submenuIndex) => {
//     setActiveSubmenu(submenuIndex);
//     setActiveItem(index);
//   };

//   // Close sidebar if click is outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target) &&
//         !menuButtonRef.current?.contains(event.target)
//       ) {
//         setIsSidebarOpen(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   return (
//     <div className="">
//       <aside
//         ref={sidebarRef}
//         className={`fixed top-0 left-0 z-40 w-64 shadow-xl md:m-5 overflow-y-auto shadow-all h-[200px] min-h-screen md:min-h-[calc(100vh-35px)] rounded-xl bg-white border-0.5 border-yellow-50 transform transition-transform duration-300
//           ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           sm:translate-x-0`}
//       >
//         <div className=" ">
//           <div className="py-3 mx-auto relative h-20 w-full ">
//             <Image
//               src="/images/logo.svg"
//               alt="Logo"
//               className="w-full lg:h-14 py-4 mx-auto"
//               fill
//             />
//           </div>

//           <ul className="space-y-2 font-medium">
//             {menuItems.map((item, index) => (
//               <li key={index} className="relative px-4 rounded">
//                 {activeItem === index && (
//                   <span className="absolute right-0 top-0 bottom-0 after:content-[''] after:absolute after:right-0 after:top-0 !after:mx-10 after:bottom-0 after:border-r-1 after:border-3 after:rounded-l-full after:max-h-11 after:border-brown-800"></span>
//                 )}

//                 {/* MAIN LINK */}
//                 <Link
//                   href={item.link}
//                   className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors duration-300
//                     ${
//                       activeItem === index
//                         ? "bg-brown-800 bg-opacity-20 hover:bg-brown-800 hover:bg-opacity-40 text-white"
//                         : "text-black hover:bg-gray-100"
//                     }`}
//                   onClick={() => {
//                     item.submenu.length > 0 && toggleDropdown(index);
//                     handleItemClick(index);
//                   }}
//                 >
//                   <div className="flex items-center">
//                     <span className="text-lg">{item.icon}</span>
//                     <span className="ml-3">{item.title}</span>
//                   </div>

//                   {item.submenu.length > 0 && (
//                     <svg
//                       className={`w-5 h-5 transition-transform ${
//                         openDropdown === index ? "rotate-180" : ""
//                       }`}
//                       fill="none"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeWidth="2"
//                         d="m19 9-7 7-7-7"
//                       />
//                     </svg>
//                   )}
//                 </Link>

//                 {/* SUBMENU */}
//                 {item.submenu.length > 0 && (
//                   <ul
//                     className={`pl-6 mt-1 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${
//                       openDropdown === index ? "max-h-48" : "max-h-0"
//                     }`}
//                   >
//                     {item.submenu.map((sub, i) => (
//                       <li key={i}>
//                         <Link
//                           href={sub.link}
//                           onClick={() => handleSubmenuClick(index, i)}
//                           className={`block px-3 py-2 rounded transition-colors
//           ${
//             activeSubmenu === i
//               ? "bg-brown-500 text-white"
//               : "text-black hover:bg-gray-200"
//           }
//         `}
//                         >
//                           {sub.title}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </aside>
//     </div>
//   );
// }

// // "use client";
// // import Image from "next/image";
// // import Link from "next/link";
// // import React, { useEffect, useRef, useState } from "react";
// // import { LuUsers } from "react-icons/lu";
// // import Users from "@/app/admin/users/page";

// // export default function Sidebar({
// //   isSidebarOpen,
// //   setIsSidebarOpen,
// //   menuButtonRef,
// // }) {
// //   const [openDropdown, setOpenDropdown] = useState(null);
// //   const [activeItem, setActiveItem] = useState(0);

// //   const sidebarRef = useRef(null);

// //   const menuItems = [
// //     {
// //       title: "Users",
// //       icon: <LuUsers />,
// //       link: "/admin/users",
// //       submenu: [],
// //     },
// //     {
// //       title: "Products",
// //       icon: <LuUsers />,
// //       link: "#",
// //       submenu: [
// //         { title: "Products", link: "/admin/products" },
// //         { title: "Billing", link: "#" },
// //         { title: "Invoice", link: "#" },
// //       ],
// //     },
// //     {
// //       title: "Settings",
// //       icon: <LuUsers />,
// //       link: "#",
// //       submenu: [
// //         { title: "General", link: "#" },
// //         { title: "Privacy", link: "#" },
// //       ],
// //     },
// //   ];

// //   const toggleDropdown = (index) => {
// //     setOpenDropdown(openDropdown === index ? null : index);
// //   };

// //   const handleItemClick = (index) => {
// //     setActiveItem(index);
// //   };

// //   // Close sidebar if click is outside
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (
// //         sidebarRef.current &&
// //         !sidebarRef.current.contains(event.target) &&
// //         !menuButtonRef.current?.contains(event.target)
// //       ) {
// //         setIsSidebarOpen(false);
// //       }
// //     };

// //     document.addEventListener("click", handleClickOutside);
// //     return () => document.removeEventListener("click", handleClickOutside);
// //   }, []);

// //   return (
// //     <div className="">
// //       <aside
// //         ref={sidebarRef}
// //         className={`fixed top-0 left-0 z-40 w-64 shadow-xl md:m-5 overflow-y-auto shadow-all h-[200px] min-h-screen md:min-h-[calc(100vh-35px)] rounded-xl bg-white border-0.5 border-yellow-50 transform transition-transform duration-300
// //           ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
// //           sm:translate-x-0`}
// //       >
// //         <div className="h-full overflow-y-auto">
// //           <div className="py-3 mx-auto relative h-20 w-full ">
// //             <Image
// //               src="/images/logo.svg"
// //               alt="Logo"
// //               className="w-full lg:h-14 py-4 mx-auto"
// //               fill
// //             />
// //           </div>

// //           <ul className="space-y-2 font-medium">
// //             {menuItems.map((item, index) => (
// //               <li key={index} className="relative px-4 rounded">
// //                 {activeItem === index && (
// //                   <span className="absolute right-0 top-0 bottom-0 after:content-[''] after:absolute after:right-0 after:top-0 !after:mx-10 after:bottom-0 after:border-r-1 after:border-3 after:rounded-l-full after:max-h-11 after:border-brown-800"></span>
// //                 )}

// //                 {/* MAIN LINK */}
// //                 <Link
// //                   href={item.link}
// //                   className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors duration-300
// //                     ${
// //                       activeItem === index
// //                         ? "bg-brown-800 bg-opacity-20 hover:bg-brown-800 hover:bg-opacity-40 text-white"
// //                         : "text-black hover:bg-gray-100"
// //                     }`}
// //                   onClick={() => {
// //                     item.submenu.length > 0 && toggleDropdown(index);
// //                     handleItemClick(index);
// //                   }}
// //                 >
// //                   <div className="flex items-center">
// //                     <span className="text-lg">{item.icon}</span>
// //                     <span className="ml-3">{item.title}</span>
// //                   </div>

// //                   {item.submenu.length > 0 && (
// //                     <svg
// //                       className={`w-5 h-5 transition-transform ${
// //                         openDropdown === index ? "rotate-180" : ""
// //                       }`}
// //                       fill="none"
// //                       stroke="currentColor"
// //                     >
// //                       <path
// //                         strokeLinecap="round"
// //                         strokeWidth="2"
// //                         d="m19 9-7 7-7-7"
// //                       />
// //                     </svg>
// //                   )}
// //                 </Link>

// //                 {/* SUBMENU */}
// //                 {item.submenu.length > 0 && (
// //                   <ul
// //                     className={`pl-6 mt-1 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${
// //                       openDropdown === index ? "max-h-48" : "max-h-0"
// //                     }`}
// //                   >
// //                     {item.submenu.map((sub, i) => (
// //                       <li key={i}>
// //                         <a
// //                           href={sub.link}
// //                           className="block px-3 py-2 rounded hover:bg-brown-500"
// //                         >
// //                           {sub.title}
// //                         </a>
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 )}
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       </aside>
// //     </div>
// //   );
// // }
