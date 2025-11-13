import Image from "next/image";
import Heading from "@/components/Heading";
import { fetchAbout } from "@/forntend/services/aboutServices";
import { useEffect, useState } from "react";
import AboutSkeleton from "@/forntend/skeleton/AboutSkeleton";

const AboutDetails = () => {
  const [aboutDetails, setAboutDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutDetails = async () => { 
      const responce = await fetchAbout();
      setAboutDetails(responce.data);
      setLoading(false);
    };
    fetchAboutDetails();
  }, []);

  if (loading) {
    return <AboutSkeleton />;
  }

  return (
    <div className="pt-10 lg:pt-28">
      <div className="container mx-auto">
        {aboutDetails.length > 0 &&
          aboutDetails.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-x-10 px-4 sm:px-0 mb-8 md:px-8 lg:px-4 xl:px-0 lg:pb-5 2xl:pb-7`}
              >
                {/* Image Section */}
                <div
                  className={`h-full ${isEven ? "lg:order-2" : "lg:order-1"}`}
                  data-aos={isEven ? "fade-left" : "fade-right"}
                >
                  <div className="h-[250px] sm:h-[300px] lg:h-full w-full relative rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt="about"
                      fill
                      className="object-cover h-full w-full"
                    />
                  </div>
                </div>

                {/* Text Section */}
                <div
                  className={`lg:pb-15 xl:pb-20 2xl:pb-25 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                  data-aos={isEven ? "fade-right" : "fade-left"}
                >
                  <Heading className="text-start !px-0">{item.heading}</Heading>

                  <p className="relative pl-8 py-5 text-nowrap tracking-widest opacity-70 text-sm md:text-lg before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-7 before:h-[2px] before:bg-gray-400">
                    {item.sub_heading}
                  </p>

                  <p className="text-gray-500 text-sm md:text-lg lg:text-sm 2xl:text-xl">
                    {item.content}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AboutDetails;
