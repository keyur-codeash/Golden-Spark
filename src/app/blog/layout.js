"use client";
import HeroSectionCommon from "@/components/HeroSectionCommon";
import { useEffect } from "react";

export default function RootLayout({ children }) {

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
