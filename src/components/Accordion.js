"use client";

import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

export default function Accordion({ accordionData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {accordionData.map((item, index) => (
        <div key={index} className="mb-4 border-b border-white/10">
          {/* Header */}
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full flex justify-between items-center cursor-pointer text-left text-black bg-transparent px-4 pb-6 pt-2 focus:outline-none"
          >
            <span className="text-lg lg:text-3xl">{item.question}</span>
            <span className="text-xl text-black">
              {activeIndex === index ? <FiMinus /> : <FiPlus />}
            </span>
          </button>

          {/* Content with transition */}
          <div
            className={`overflow-hidden transition-all duration-300 px-4 text-sm lg:text-lg text-gray-400  border-b-1 border-gray-200  ${
              activeIndex === index ? "max-h-40 pb-2" : "max-h-0 py-0"
            }`}
          >
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
