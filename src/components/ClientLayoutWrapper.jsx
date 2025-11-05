"use client";

import { usePathname } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      <Header />
      {children}
      <Footer />
    </>
  );
}
