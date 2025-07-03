import React from "react";
import { FaShippingFast } from "react-icons/fa";
import { GiCommercialAirplane } from "react-icons/gi";
import { MdOutlinePayments } from "react-icons/md";
import { SiAmazonsimpleemailservice } from "react-icons/si";

const FeaturesSection = () => {
  // Dynamic feature data
  const features = [
    {
      id: 1,
      title: "Free Shipping",
      description:
        "All the business growth and profile revolve are effective catchy...",
      icon: <FaShippingFast />,
    },
    {
      id: 2,
      title: "One Day Delivery",
      description:
        "It's just a little bit from the diam hendrerit sometimes who doesn't have a lake...",
      icon: <GiCommercialAirplane />,
    },
    {
      id: 3,
      title: "Online Payments",
      description:
        "Until and pure not free vulputa teultr icesque ullamcorper.",
      icon: <MdOutlinePayments />,
    },
    {
      id: 4,
      title: "Customer Service",
      description:
        "Felis Hendrerit trucks. Each protein is just a little bit, and a little bit too much.",
      icon: <SiAmazonsimpleemailservice />,
    },
  ];

  return (
    <section className="pb-5 pt-10 sm:py-18 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className=" p-4 rounded-lg transition-shadow duration-300"
              >
                <div className="flex items-start justify-start">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full text-brown-800 text-4xl mr-4">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl pb-3 text-brown-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-md 2xl:text-lg">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
