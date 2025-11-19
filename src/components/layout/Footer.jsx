import { footerData } from "@/data/data";
import React, { useState } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import FeaturesSection from "../home/FeaturesSection";
import { subcribMail } from "@/forntend/services/policySevices";

const Footer = ({
  newsletterTitle = footerData.newsletterTitle,
  newsletterDescription = footerData.newsletterDescription,
  inputPlaceholder = footerData.inputPlaceholder,
  sections = footerData.sections,
  copyrightText = footerData.copyrightText,
  backgroundImage = footerData.backgroundImage,
}) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await subscribeEmail();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const subscribeEmail = async () => {
    try {
      const response = await subcribMail({ email });

      setMessage(response?.message || "Subscribed successfully!");
      setEmail("");
    } catch (error) {
      setMessage("Something went wrong, try again.");
    }
  };

  return (
    <>
      <div data-aos="fade-up">
        <FeaturesSection />
      </div>
      <footer
        className="text-gray-300 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="bg-black opacity-85 absolute top-0 left-0 right-0 bottom-0"></div>
        <div className="container mx-auto px-4 pt-15 sm:pt-25 pb-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="mb-0">
              <div className="text-left">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {newsletterTitle}
                </h2>
                <p className="mb-6 text-lg">{newsletterDescription}</p>
                <div className="relative w-full max-w-md">
                  <form onSubmit={handleSubmit}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={inputPlaceholder}
                      className="w-full px-4 py-3 rounded-md bg-yellow-100 backdrop-blur-sm border border-gray-600 text-black focus:outline-none focus:ring-2"
                      required
                    />

                    <HiOutlineArrowNarrowRight
                      onClick={handleSubmit}
                      className="text-black absolute top-3 right-4 cursor-pointer transition-colors"
                      size={25}
                    />
                  </form>

                  {/* Success / error message */}
                  {message && (
                    <p className="text-sm text-green-300 mt-2">{message}</p>
                  )}
                </div>
              </div>
            </div>

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
                          className="hover:text-white transition-colors flex items-center gap-2 text-lg"
                        >
                          {link.icon && (
                            <img
                              src={link.icon}
                              alt="icon"
                              className="w-5 h-5 inline-block"
                            />
                          )}
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-white opacity-40 my-8"></div>

          <div className="text-center text-lg text-gray-400">
            {copyrightText}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

// import { footerData } from "@/data/data";
// import React, { useState } from "react";
// import { HiOutlineArrowNarrowRight } from "react-icons/hi";
// import FeaturesSection from "../home/FeaturesSection";
// import { subcribMail } from "@/forntend/services/policySevices";

// const Footer = ({
//   newsletterTitle = footerData.newsletterTitle,
//   newsletterDescription = footerData.newsletterDescription,
//   inputPlaceholder = footerData.inputPlaceholder,
//   sections = footerData.sections,
//   copyrightText = footerData.copyrightText,
//   backgroundImage = footerData.backgroundImage,
// }) => {
//   const [email, setEmail] = useState("");

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     subScribeEmail();
//   };

//   const subScribeEmail = async () => {
//     const response = await subcribMail({ email });
//     setEmail(response.message);
//   };

//   return (
//     <>
//       <div data-aos="fade-up">
//         <FeaturesSection />
//       </div>
//       <footer
//         className="text-gray-300 relative bg-cover bg-center bg-no-repeat"
//         style={{ backgroundImage: `url(${backgroundImage})` }}
//       >
//         <div className="bg-black opacity-85 absolute top-0 left-0 right-0 bottom-0"></div>
//         <div className="container mx-auto px-4 pt-15 sm:pt-25 pb-10 relative z-10">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
//             <div className="mb-0">
//               <div className="text-left">
//                 <h2 className="text-3xl font-bold text-white mb-4">
//                   {newsletterTitle}
//                 </h2>
//                 <p className="mb-6 text-lg">{newsletterDescription}</p>
//                 <div className="relative w-full max-w-md">
//                   <form action="" onSubmit={handleSubmit}>
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder={inputPlaceholder}
//                       className="w-full px-4 py-3 rounded-md bg-yellow-100 backdrop-blur-sm border border-gray-600 text-black focus:outline-none focus:ring-2"
//                     />
//                     <HiOutlineArrowNarrowRight
//                       onClick={handleSubmit}
//                       className="text-black absolute top-3 right-4 cursor-pointer transition-colors"
//                       size={25}
//                     />
//                   </form>
//                 </div>
//               </div>
//             </div>

//             {/* Dynamic Sections */}
//             {sections.map((section, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   index === 0
//                     ? "md:justify-center lg:justify-end"
//                     : index === sections.length - 1
//                     ? "md:justify-center lg:justify-end"
//                     : "lg:justify-end"
//                 }`}
//               >
//                 <div>
//                   <h3 className="text-white text-lg xl:text-3xl mb-4">
//                     {section.title}
//                   </h3>
//                   <ul className="space-y-3 flex sm:block flex-wrap gap-x-5">
//                     {section.links.map((link, linkIndex) => (
//                       <li key={linkIndex}>
//                         <a
//                           href={link.href}
//                           className="hover:text-white transition-colors block text-lg"
//                         >
//                           {link.label}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="border-t-2 border-white opacity-40 my-8"></div>

//           <div className="text-center text-lg text-gray-400">
//             {copyrightText}
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// };

// export default Footer;
