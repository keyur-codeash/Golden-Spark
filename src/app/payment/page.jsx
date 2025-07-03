"use client";
import React, { useEffect } from "react";
import ProductTotalCard from "../check-out/component/ProductTotalCard";
import PaymentForm from "./component/PaymentForm";
import HeroSectionCommon from "@/components/HeroSectionCommon";
import AOS from "aos";
import "aos/dist/aos.css";

function page() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div>
      <div data-aos="fade-up">
        <HeroSectionCommon heading="Home/Payment" />
      </div>
      <div className="container mx-auto">
        <div className="pt-10 lg:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 px-4 xl:px-0 gap-10">
            <div>
              <PaymentForm />
            </div>
            <div className="lg:ps-2 xl:ms-30 2xl:ms-50">
              <ProductTotalCard
                isPaymnetUI={true}
                btntext="PLACE ORDER"
                navigate="orders/confirmed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
