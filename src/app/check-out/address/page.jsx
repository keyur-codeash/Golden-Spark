"use client";
import React, {useState } from "react";
import AddressManagement from "./component/addresses";

const AddressSelection = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "HOME",
      address: "50 Washington Square S, New York, NY 10012, USA",
      payOnDelivery: true,
      selected: false,
    },
  ]);

  return (
    <div className="">
      <div data-aos="fade-up">
        <AddressManagement />
      </div>
    </div>
  );
};

export default AddressSelection;
