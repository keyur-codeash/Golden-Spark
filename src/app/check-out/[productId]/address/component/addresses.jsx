"use client";
import { useState } from "react";
import BillingDetailsForm from "../../component/BillingDetailsForm";
import Modal from "@/components/Model";
import Button from "@/components/Button";
import ProductTotalCard from "../../component/ProductTotalCard";

export default AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);

  const openModal = (address = null) => {
    setCurrentAddress(address);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAddress(null);
  };

  const handleAddOrUpdateAddress = (values) => {
    if (currentAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === currentAddress.id ? { ...addr, ...values } : addr
        )
      );
    } else {
      // Add new address
      const newAddress = {
        id: Math.max(...addresses.map((a) => a.id), 0) + 1,
        ...values,
        selected: false,
      };
      setAddresses((prev) => [...prev, newAddress]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleChange = (id) => {
    setAddresses((prev) =>
      prev.map((addr, index) => ({
        ...addr,
        selected: index === id,
      }))
    );
  };

  return (
    <div className="container mx-auto ">
      <div className=" lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-3">
              Selected Address Details
            </h2>

            {addresses.map((address, index) => (
              <div
                key={address.id}
                className="border border-gray-300 rounded-lg p-4 mb-4"
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    checked={address.selected}
                    onChange={() => handleChange(index)}
                  />
                  <p className="font-semibold text-xl px-2 capitalize">
                    {address?.type}
                  </p>
                </div>
                <div className="pt-2">
                  <div className="px-7 text-lg">
                    <p className="text-gray-700">{`${address.address}, ${address.city}, ${address.state}, ${address.country}`}</p>
                    {address.selected && (
                      <p className="text-gray-700 mb-2">
                        • Pay on delivery available
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 px-6 py-2">
                  <Button
                    label="REMOVE"
                    type="button"
                    color="blue"
                    size="md"
                    variant="solid"
                    className="!bg-transparent !text-black border"
                    onClick={() => handleDelete(address.id)}
                  />
                  <Button
                    label="EDIT"
                    type="button"
                    color="blue"
                    size="md"
                    variant="solid"
                    className="!bg-yellow-800"
                    onClick={() => handleUpdateAddress(address)}
                  />
                </div>
              </div>
            ))}

            <p
              onClick={() => openModal()}
              className="border border-dashed border-gray-400 cursor-pointer rounded-lg w-full p-3 font-semibold text-gray-700"
            >
              + Add New Address
            </p>

            {isModalOpen && (
              <div className="container mx-auto">
                <Modal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  maxWidth="max-w-2xl"
                  closeIcon={false}
                  maxHeight="max-h-screen"
                >
                  <div className="bg-white rounded-lg px-6 w-full">
                    <div className="">
                      <BillingDetailsForm
                        onClose={closeModal}
                        title={
                          currentAddress ? "Edit Address" : "Add New Address"
                        }
                        overflow={true}
                        initialValues={currentAddress || null}
                        onSubmit={handleAddOrUpdateAddress}
                      />
                    </div>
                  </div>
                </Modal>
              </div>
            )}
          </div>
          <div className="lg:ps-2 xl:ms-30 2xl:ms-50 px-5 lg:px-0">
            <ProductTotalCard />
          </div>
        </div>
      </div>
    </div>
  );
}
