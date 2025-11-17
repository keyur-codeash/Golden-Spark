// components/AOSProvider.jsx
"use client";
import { useEffect } from "react";
import { usePathname } from 'next/navigation';
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider({ children }) {
  const pathname = usePathname();
 console.log("pathname===", pathname);
 
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });
  }, [pathname]); 

  return <>{children}</>
}
