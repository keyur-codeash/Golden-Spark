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
        <div className="blog">
          <HeroSectionCommon heading="Blog" />
        </div>
        <div data-aos="fade-up">{children}</div>
      </body>
    </html>
  );
}
