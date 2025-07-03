import { footerData } from "@/data/data";
import React from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import FeaturesSection from "../home/FeaturesSection";

const Footer = ({
  newsletterTitle = footerData.newsletterTitle,
  newsletterDescription = footerData.newsletterDescription,
  inputPlaceholder = footerData.inputPlaceholder,
  sections = footerData.sections,
  copyrightText = footerData.copyrightText,
  backgroundImage = footerData.backgroundImage,
}) => {
  return (
    <>
      <FeaturesSection />
      <footer
        className="text-gray-300 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Overlay */}
        <div className="bg-black opacity-85 absolute top-0 left-0 right-0 bottom-0"></div>

        {/* Content */}
        <div className="container mx-auto px-4 pt-15 sm:pt-25 pb-10 relative z-10">
          {/* Newsletter and Links Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Newsletter Column */}
            <div className="mb-0">
              <div className="text-left">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {newsletterTitle}
                </h2>
                <p className="mb-6 text-lg">{newsletterDescription}</p>
                <div className="relative w-full max-w-md">
                  <input
                    type="email"
                    placeholder={inputPlaceholder}
                    className="w-full px-4 py-3 rounded-md bg-yellow-100 backdrop-blur-sm border border-gray-600 text-black focus:outline-none focus:ring-2"
                  />
                  <HiOutlineArrowNarrowRight
                    className="text-black absolute top-3 right-4 cursor-pointer transition-colors"
                    size={25}
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Sections */}
            {sections.map((section, index) => (
              <div
                key={index}
                className={`flex ${
                  index === 0
                    ? "md:justify-center lg:justify-end"
                    : index === sections.length - 1
                    ? "md:justify-center lg:justify-end"
                    : "lg:justify-end"
                }`}
              >
                <div>
                  <h3 className="text-white text-lg xl:text-3xl mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3 flex sm:block flex-wrap gap-x-5">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.href}
                          className="hover:text-white transition-colors block text-lg"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t-2 border-white opacity-40 my-8"></div>

          {/* Copyright */}
          <div className="text-center text-lg text-gray-400">
            {copyrightText}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
