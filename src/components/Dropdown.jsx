"use client";

import { useState, useEffect, useRef } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const Dropdown = ({
  options,
  selectedOption,
  onSelect,
  renderOption,
  renderSelected,
  className = "",
  dropdownClassName = "",
  position = "bottom",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative z-50  ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-start w-full gap-2 px-4 py-2 rounded cursor-pointer"
      >
        {renderSelected ? (
          renderSelected(selectedOption)
        ) : (
          <span>{selectedOption.label}</span>
        )}
        {isOpen ? (
          <MdKeyboardArrowUp size={20} />
        ) : (
          <MdKeyboardArrowDown size={20} />
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            position === "bottom" ? "mt-2" : "bottom-full mb-2"
          } bg-white text-black w-full rounded shadow-lg z-50 ${dropdownClassName}`}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {renderOption ? (
                renderOption(option)
              ) : (
                <span>{option.label}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
