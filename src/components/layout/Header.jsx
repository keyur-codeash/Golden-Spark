"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LuUser, LuSearch, LuX, LuShoppingBag, LuLogOut } from "react-icons/lu";
import { RiShoppingBag4Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { accountOptions, countries, menuItems } from "@/data/data";
import { CgCloseR } from "react-icons/cg";
import Button from "../Button";
import Dropdown from "../Dropdown";
import { useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedAccount, setSelectedAccount] = useState(accountOptions[0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (itemPath) => {
    return itemPath === "/" ? pathname === "/" : pathname.startsWith(itemPath);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // TODO: Replace this with actual filtered results
    setSearchResults([
      { id: 1, name: "Sample Result", url: "#", category: "Example" },
    ]);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  // profile details
  const [open, setOpen] = useState(false);
  const modalRef = useRef(null);

  const user = {
    name: "Keyur Patel",
    email: "keyur@example.com",
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogout = () => {
    console.log("User logged out");
    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 w-full z-40 transition-all duration-300 bg-light-gray-300  ${
        isScrolled ? "shadow-sm md:py-2" : "bg-transparent md:py-2"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center bg-brown-800 md:bg-transparent px-4 xl:px-0 py-3">
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link href="/" className="order-2">
              <img
                src="/images/logo.svg"
                alt="Logo"
                className="h-10 lg:h-14 hidden md:block w-auto"
              />
              <img
                src="/images/mobile.logo.svg"
                alt="Logo"
                className="md:hidden w-auto"
              />
            </Link>
            <button
              className="md:hidden focus:outline-none order-1 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col space-y-1">
                <span
                  className={`h-0.5 w-full bg-white transition-all ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-white transition-all ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-white transition-all ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </div>
            </button>

            <div className="md:hidden order-3">
              <ul className="flex items-center">
                <li className="ps-4 pt-2">
                  <button onClick={() => setIsSearchOpen(true)}>
                    <LuSearch size={24} className="text-white" />
                  </button>
                </li>
                <li className="ps-4">
                  <Link href="/your-cart">
                    <RiShoppingBag4Line size={24} className="text-white " />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item, index) =>
              item.children ? (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(index)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 text-sm lg:text-lg lg:px-2 xl:px-6 font-medium text-gray-700 hover:text-gray-900">
                    {item.name}
                    <MdKeyboardArrowDown />
                  </button>
                  <div
                    className={`absolute top-full left-0 w-44 bg-white border rounded shadow-md z-50 overflow-hidden transition-all duration-300 ease-in-out ${
                      openDropdown === index
                        ? "opacity-100 max-h-96"
                        : "opacity-0 max-h-0 pointer-events-none"
                    }`}
                  >
                    {item.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        href={child.path}
                        className={`block px-4 py-2 text-sm lg:text-lg whitespace-nowrap ${
                          pathname === child.path
                            ? "text-brown-800 bg-gray-100"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={index}
                  href={item.path}
                  className={`relative text-sm lg:text-lg font-medium lg:px-2 xl:px-6 ${
                    isActive(item.path)
                      ? "after:content-[''] after:absolute after:left-1/2 after:translate-x-[-50%] after:bottom-0 after:w-[35px] after:h-[1px] after:bg-brown-800 text-brown-800"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Icons + Search */}
          <div className="block" ref={searchRef}>
            <ul className="flex items-center">
              <li className="relative ps-4 hidden md:block">
                <button
                  onClick={() => setOpen(!open)}
                  className="py-2 rounded-full transition"
                >
                  <LuUser className="lg:text-xl cursor-pointer" />
                </button>

                {/* Dropdown Modal */}
                {open && (
                  <div
                    ref={modalRef}
                    className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-brown-400  backdrop-blur-xl rounded-lg shadow-lg bg-yellow-400 z-50 animate-fadeIn"
                  >
                    <div className="bg-white rounded-xl">
                      {/* User Info */}
                      <div className="px-5 py-4 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            router.push("/orders");
                            setOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-5 py-2.5 text-sm cursor-pointer transition"
                        >
                          <LuShoppingBag className="text-base" />
                          <span>My Orders</span>
                        </button>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-5 py-2.5 text-sm text-red-600 cursor-pointer transition"
                        >
                          <LuLogOut className="text-base" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>

              <li className="ps-4 pt-1.5 hidden md:block">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="relative"
                >
                  <LuSearch className="lg:text-xl cursor-pointer" />
                </button>
              </li>
              <li className="ps-4 hidden md:block">
                <Link href="/your-cart">
                  <RiShoppingBag4Line className="lg:text-xl" />
                </Link>
              </li>
              <li className="ps-4 hidden md:block">
                <Link href="/wishlist">
                  <FaRegHeart className="text-md lg:text-xl" />
                </Link>
              </li>
            </ul>

            {isSearchOpen && (
              <div className="absolute top-0 left-0 right-0 w-full pb-35 pt-5 bg-yellow-400 rounded-lg shadow-sm border border-gray-200 z-50 overflow-hidden px-4 md:px-0">
                <div className="container mx-auto pt-4">
                  <div className="flex justify-end">
                    <button
                      className="ml-2 cursor-pointer hover:text-gray-700"
                      onClick={clearSearch}
                    >
                      <CgCloseR className="text-2xl text-black" />
                    </button>
                  </div>
                  <p className="py-4 text-xl">What are you looking for?</p>
                  <div className="py-3 border-b border-black flex items-center pb-5">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Search...."
                      className="w-full focus:outline-none bg-transparent placeholder:text-black placeholder:font-bold placeholder:text-xl text-lg"
                      autoFocus
                    />
                    <button className="ml-2 text-gray-500 hover:text-gray-700">
                      <LuSearch className=" text-2xl text-black" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto mt-4 bg-white rounded-md shadow-inner">
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={result.url}
                        className="block p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                        onClick={clearSearch}
                      >
                        <div className="font-medium text-gray-800">
                          {result.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          in {result.category}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 bg-yellow-400 fixed top-[60px] left-0 w-full h-[calc(100vh-60px)] overflow-y-auto z-40 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <nav className="flex flex-col space-y-3 pb-20 py-4">
            {menuItems.map((item, index) =>
              item.children ? (
                <div key={index}>
                  <div
                    className="flex justify-between items-center border-b border-gray-300 mx-4 cursor-pointer text-gray-800 font-medium py-2"
                    onClick={() =>
                      openDropdown === index
                        ? setOpenDropdown(null)
                        : setOpenDropdown(index)
                    }
                  >
                    <span className="text-lg">{item.name}</span>
                    <MdKeyboardArrowDown
                      className={`transition-transform duration-300 ${
                        openDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openDropdown === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        href={child.path}
                        className={`block ml-7 py-3 font-medium text-md border-b border-gray-300 mx-4 ${
                          pathname === child.path
                            ? "text-brown-800"
                            : "text-gray-700 hover:text-gray-800"
                        }`}
                        onClick={() => {
                          setIsMenuOpen(false);
                          setOpenDropdown(null);
                        }}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={index}
                  href={item.path}
                  className={`border-b border-gray-300 mx-4 font-medium py-2 text-lg ${
                    isActive(item.path)
                      ? "text-brown-800"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>
          <div className="px-4">
            <Button
              label="LOG IN"
              icon={<LuUser size={22} />}
              color="blue"
              size="md"
              variant="solid"
              className="!bg-yellow-800 !rounded-0 py-2.5 mt-5 flex items-center gap-1 !text-xl"
              onClick={() => router.push("auth/sign-in")}
            />
            <div className="border-b border-gray-300 mt-10"></div>
            <div className="flex items-center gap-4 ">
              <div>
                <Dropdown
                  options={countries}
                  selectedOption={selectedCountry}
                  onSelect={setSelectedCountry}
                  renderSelected={(option) => (
                    <div className="flex items-center gap-2 text-nowrap">
                      <img
                        src={option.icon}
                        alt="img"
                        className="w-[1.5rem] h-[1.5rem] rounded-full"
                      />
                      {option.label}(CAD$)
                    </div>
                  )}
                  renderOption={(option) => (
                    <div className="flex items-center gap-2 text-nowrap pe-5">
                      <img
                        src={option.icon}
                        alt="img"
                        className="w-[1.5rem] h-[1.5rem] rounded-full"
                      />{" "}
                      {option.label}(CAD$)
                    </div>
                  )}
                  className="w-50"
                  dropdownClassName="w-48 !bg-transparent !shadow-xl"
                />
              </div>

              <Dropdown
                options={accountOptions}
                selectedOption={selectedAccount}
                onSelect={setSelectedAccount}
                className="w-30"
                dropdownClassName="w-48 !bg-transparent !shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
