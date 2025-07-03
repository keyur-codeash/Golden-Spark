"use client";
import React, { useEffect } from "react";
import BillingDetailsForm from "./component/BillingDetailsForm";
import ProductTotalCard from "./component/ProductTotalCard";
import AOS from "aos";
import "aos/dist/aos.css";

function page() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="container mx-auto">
      <div className="pt-30">
        <div className="grid grid-cols-1 lg:grid-cols-2 px-4 xl:px-0 gap-10">
          <div data-aos="fade-up">
            <BillingDetailsForm contant={true} title="Billing Details" />
          </div>
          <div className="lg:ps-2 xl:ms-30 2xl:ms-50 ">
            <div data-aos="fade-up">
              <ProductTotalCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
