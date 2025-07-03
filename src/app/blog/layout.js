"use client";
import HeroSectionCommon from "@/components/HeroSectionCommon";

import "aos/dist/aos.css";
import AOS from "aos";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <html lang="en">
      <body>
        <div data-aos="fade-up">
          <div className="blog">
            <HeroSectionCommon heading="Home/Blog" />
          </div>
        {/* <LoadingSpinner /> */} {children}
                </div>

      </body>
    </html>
  );
}
