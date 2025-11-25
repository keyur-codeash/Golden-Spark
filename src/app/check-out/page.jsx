"use client";
import React, { useEffect } from "react";
import BillingDetailsForm from "./component/BillingDetailsForm";
import ProductTotalCard from "./component/ProductTotalCard";
import { createAddress } from "@/forntend/services/addressServices";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();
  const handleAddOrUpdateAddress = async (values) => {
    const { subscribe, ...payload } = values;
    delete values.subscribe;
    const response = await createAddress(values);
    if (response.isSuccess) {
      router.push("/check-out/address");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto">
      <div className="pt-30">
        <div className="grid grid-cols-1 lg:grid-cols-2 px-4 xl:px-0 gap-10">
          <div data-aos="fade-up">
            <BillingDetailsForm
              contant={true}
              title="Billing Details"
              onSubmit={handleAddOrUpdateAddress}
            />
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
