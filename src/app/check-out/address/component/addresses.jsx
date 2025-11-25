"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CommonModel from "@/components/Model";
import Button from "@/components/Button";
import {
  createAddress,
  deleteAddress,
  fetchAddress,
  updateAddress,
} from "@/forntend/services/addressServices";
import Toast from "@/components/toastService";
import SkeletonCart from "@/forntend/skeleton/BillingSkeleton";
import ProductTotalCard from "../../component/ProductTotalCard";
import BillingDetailsForm from "../../component/BillingDetailsForm";

export default function AddressManagement() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [loading, setloading] = useState(true);

  // Open modal for Add/Edit
  const openModal = (address = null) => {
    setCurrentAddress(address);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAddress(null);
  };

  // Add or Update Address
  const handleAddOrUpdateAddress = async (values) => {
    try {
      if (currentAddress) {
        delete values.subscribe;
        delete values.createdAt;
        delete values.updatedAt;
        delete values.__v;
        const response = await updateAddress(values);
        if (response.isSuccess) {
          Toast.success("Address updated successfully!");
          setAddresses((prev) =>
            prev.map((addr) =>
              addr._id === currentAddress._id ? { ...addr, ...values } : addr
            )
          );
          setCurrentAddress(null);
        }
      } else {
        // Add new address
        const { subscribe, ...payload } = values;
        const response = await createAddress(payload);
        if (response.isSuccess) {
          setAddresses((prev) => [...prev, response.data]);
          router.push("/check-out/address");
        }
      }
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      closeModal();
    }
  };

  // Delete Address
  const handleDelete = async (id) => {
    try {
      const response = await deleteAddress(id);
      if (response.isSuccess) {
        Toast.success("Address removed successfully!");
        setAddresses((prev) => prev.filter((addr) => addr._id !== id));
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleChange = async (data) => {
    delete data.createdAt;
    delete data.updatedAt;
    delete data.__v;

    const response = await updateAddress({
      ...data,
      isDefault: true,
    });
    if (response?.isSuccess) {
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr._id === data._id,
        }))
      );
    }
  };

  // Fetch All Addresses
  useEffect(() => {
    const fetchAllAddress = async () => {
      try {
        const response = await fetchAddress();
        if (response.isSuccess) {
          if (!response?.data?.length) {
            router.push("/check-out");
          }
          setloading(false);
          setAddresses(response.data);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAllAddress();
  }, []);

  const checkSelectedAddress = () => {
    const findSelected = addresses.find((item) => item.isDefault == true);
    console.log("findSelected===", findSelected);

    if (findSelected) {
      return findSelected._id;
    } else {
      return false;
    }
  };

  // console.log("addresses=24125==", checkSelectedAddress());

  if (loading) {
    return (
      <>
        <div className="container mx-auto">
          <div className="lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
              <div className="p-4">
                {/* Skeleton for address section */}
                <div className="skeleton-container">
                  <div className="skeleton-title h-8 w-64 mb-6 bg-[#755c4e13] rounded"></div>

                  {/* Skeleton address cards */}
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="border border-gray-300 rounded-lg p-4 mb-4"
                    >
                      <div className="flex items-center mb-4">
                        <div className="skeleton-radio h-5 w-5 bg-[#755c4e13] rounded-full"></div>
                        <div className="skeleton-type h-6 w-32 bg-[#755c4e13] rounded ml-2"></div>
                      </div>
                      <div className="pt-2">
                        <div className="px-7">
                          <div className="skeleton-address-line h-4 w-full bg-[#755c4e13] rounded mb-2"></div>
                          <div className="skeleton-address-line h-4 w-3/4 bg-[#755c4e13] rounded mb-2"></div>
                          <div className="skeleton-delivery-text h-4 w-48 bg-[#755c4e13] rounded"></div>
                        </div>
                      </div>
                      <div className="flex space-x-2 px-6 py-4">
                        <div className="skeleton-button h-10 w-24 bg-[#755c4e13] rounded"></div>
                        <div className="skeleton-button h-10 w-24 bg-[#755c4e13] rounded"></div>
                      </div>
                    </div>
                  ))}

                  <div className="skeleton-add-new h-12 w-full bg-[#755c4e13] rounded-lg mt-4"></div>
                </div>
              </div>
              <div className="lg:ps-2 xl:ms-30 2xl:ms-50 px-5 lg:px-0">
                <SkeletonCart />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-3">
              Selected Address Details
            </h2>

            {addresses.map((address) => (
              <div
                key={address._id}
                className="border border-gray-300 rounded-lg p-4 mb-4"
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    checked={address.isDefault}
                    onChange={() => handleChange(address)}
                  />
                  <p className="font-semibold text-xl px-2 capitalize">
                    {address?.type}
                  </p>
                </div>
                <div className="pt-2">
                  <div className="px-7 text-lg">
                    <p className="text-gray-700">{`${address.address}, ${address.city}, ${address.state}, ${address.country}`}</p>
                    {address.isDefault && (
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
                    onClick={() => handleDelete(address._id)}
                  />
                  <Button
                    label="EDIT"
                    type="button"
                    color="blue"
                    size="md"
                    variant="solid"
                    className="!bg-yellow-800"
                    onClick={() => openModal(address)}
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
                <CommonModel
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  maxWidth="max-w-2xl"
                  closeIcon={false}
                  maxHeight="max-h-screen"
                >
                  <div className="bg-white rounded-lg px-6 w-full py-5">
                    <BillingDetailsForm
                      onClose={closeModal}
                      title={
                        currentAddress ? "Edit Address" : "Add New Address"
                      }
                      overflow={true}
                      initialValues={currentAddress || {}}
                      onSubmit={handleAddOrUpdateAddress}
                    />
                  </div>
                </CommonModel>
              </div>
            )}
          </div>

          <div className="lg:ps-2 xl:ms-30 2xl:ms-50 px-5 lg:px-0">
            <ProductTotalCard
              loading={loading}
              addresses={checkSelectedAddress()}
              handleProductOrder={false}
              navigate={`/payment/${checkSelectedAddress()}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
