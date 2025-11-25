"use client";
import React, { useEffect, useState } from "react";
import PaymentForm from "./component/PaymentForm";
import HeroSectionCommon from "@/components/HeroSectionCommon";

import ProductTotalCard from "@/app/check-out/component/ProductTotalCard";
import { createOrder } from "@/forntend/services/orderServices";
import { useRouter } from "next/navigation";
import { useAddtocart } from "@/forntend/context/AddToCartContext";

const Page = () => {
  const router = useRouter();
  const [orderErrors, setOrderErrors] = useState([]);
  const {
    removeAllAddToCartList,
    clearSingleProduct,
    removeAllproductList,
    singleProduct,
  } = useAddtocart();

  const handleOrder = async (data) => {
    try {
      const response = await createOrder(data);
      console.log("Order Response ===", response);

      if (response.isSuccess) {
        setOrderErrors([]);
        router.push(`/orders/confirmed/${response.orderId}`);
        if (singleProduct?.length > 0) {
          clearSingleProduct();
        } else {
          removeAllproductList();
        }
        removeAllAddToCartList();
      } else {
        setOrderErrors(response.failedOrders || []);
      }
    } catch (err) {
      console.error("Order Error:", err);
      setOrderErrors([
        {
          variantId: "general",
          message: "Something went wrong, please try again.",
        },
      ]);
    }
  };

  return (
    <div>
      <HeroSectionCommon heading="Payment" />
      <div data-aos="fade-up"></div>
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
                onclick={(msg) => handleOrder(msg)}
                navigate="/orders/confirmed"
                orderErrors={orderErrors}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
