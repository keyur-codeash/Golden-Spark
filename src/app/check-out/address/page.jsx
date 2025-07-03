"use client";
import React, { useEffect, useState } from "react";
import AddressManagement from "./component/addresses";
// import AOS from "aos";
// import "aos/dist/aos.css";

const AddressCard = ({
  type = "HOME",
  address = "50 Washington Square S, New York, NY 10012, USA",
  payOnDelivery = true,
  onRemove,
  onEdit,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div className="border rounded-lg p-4 mb-4">
      {/* <div className="flex items-start">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => setIsSelected(!isSelected)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <span className="font-medium">{type}</span>
          </div>
          <p className="text-gray-600 mt-1">{address}</p>
          {payOnDelivery && (
            <p className="text-green-600 text-sm mt-1">
              Pay on delivery available
            </p>
          )}
        </div>
      </div>
      <div className="flex space-x-4 mt-4 pl-8">
        <button onClick={onRemove} className="text-red-600 hover:text-red-800">
          REMOVE
        </button>
        <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
          EDIT
        </button>
      </div> */}
    </div>
  );
};

// useEffect(() => {
//   AOS.init({ duration: 800, once: true });
// }, []);

const AddressSelection = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "HOME",
      address: "50 Washington Square S, New York, NY 10012, USA",
      payOnDelivery: true,
      selected: false,
    },
    // Add more addresses as needed
  ]);

  const handleRemove = (id) => {
    setAddresses(addresses.filter((address) => address.id !== id));
  };

  const handleEdit = (id) => {
    // Handle edit logic here
    console.log("Editing address:", id);
  };

  const handleAddNew = () => {
    // Handle add new address logic
    console.log("Add new address clicked");
  };

  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-6">Selected Address Details</h1> */}
      <div data-aos="fade-up">
        <AddressManagement />
      </div>
    </div>
  );
};

export default AddressSelection;
