"use client";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import CommonModel from "@/components/Model";
import Toast from "@/components/toastService";
import { cancelOrder } from "@/forntend/services/orderServices";
import Image from "next/image";
import { GoArrowLeft } from "react-icons/go";
import { useRouter } from "next/navigation";

const CancelOrderModal = ({
  isModalOpen,
  setIsModalOpen,
  orderDetails,
  cancelDetails,
  setCancelId,
}) => {
  const router = useRouter();
  const closeModal = () => setIsModalOpen(false);

  const handleOrderCancel = async () => {
    const response = await cancelOrder(cancelDetails);
    console.log("response======", response);
    Toast.success("Order cancelled successfully");
    router.push("/orders");
    setCancelId(cancelDetails._id);
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center p-4">
      {/* Modal */}
      {isModalOpen && (
        <CommonModel
          isOpen={isModalOpen}
          onClose={closeModal}
          orderDetails={orderDetails}
          maxWidth="max-w-xl"
        >
          {/* Modal Content */}
          <div className="select-none py-7">
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
                  onClick={handleOrderCancel}
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
        </CommonModel>
      )}
    </div>
  );
};

export default CancelOrderModal;
