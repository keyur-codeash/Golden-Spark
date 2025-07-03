"use client";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Modal from "@/components/Model";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";

const CancelOrderModal = ({isModalOpen, setIsModalOpen}) => {

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex items-center justify-center p-4">
      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal} maxWidth="max-w-xl">
          {/* Modal Content */}
          <div className="select-none">
            {/* Header */}
            <div className="p-6 rounded-t-lg">
              <div className="relative w-25 h-25 mx-auto">
                <Image
                  src="/icons/order-confirmed.svg"
                  alt="Checked"
                  fill
                  className="mx-auto"
                />
              </div>
              <Heading className="pt-4 font-bold text-gray-800">
                Order Cancelled
              </Heading>
            </div>

            {/* Warning Message */}
            <div className="px-4">
              <div className="flex text-xl">
                <GoArrowLeft className="me-8" size={26} /> Cancel Order?
              </div>
              <div className="bg-yellow-300 border-2 p-2  mt-4 rounded-lg">
                <p className="flex text-xl text-gray-800">
                  <GoArrowLeft className="me-4" size={26} /> Your entire order
                  will be cancelled
                </p>
                <p className="text-lg ps-11 pt-3 text-gray-600">
                  Items are packed together and will be cancelled together
                </p>
              </div>

              {/* Confirmation Prompt */}
              <p className="mt-5 text-black text-lg">
                Are you sure you want to proceed?
              </p>

              {/* Buttons */}
              <div className="mt-6 flex justify-center gap-4">
                <Button
                  type="button"
                  label="YES, CANCEL"
                  size="md"
                  variant="outline"
                  className="w-full !rounded-0 py-3.5 !text-black flex items-center gap-[10px]"
                  onClick={() => setIsModalOpen(false)}
                />

                <Button
                  type="button"
                  label="I WANT MY ORDER"
                  color="blue"
                  size="md"
                  variant="solid"
                  className="!bg-yellow-800 w-full !rounded-0 py-3.5 flex items-center gap-[10px]"
                  onClick={() => setIsModalOpen(false)}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CancelOrderModal;
