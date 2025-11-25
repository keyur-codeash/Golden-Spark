"use client";
import CommonModel from "@/components/Model";
import { FaCheck } from "react-icons/fa6";

const TrackingModalPage = ({
  isModalOpen,
  setIsModalOpen,
  orderTrakingDetails,
}) => {
  const closeModal = () => setIsModalOpen(false);

  const inProgressIndex = orderTrakingDetails?.events?.findLastIndex(
    (event) => !event.completed
  );

  return (
    <div className="flex items-center justify-center p-4">

<CommonModel isOpen={isModalOpen} onClose={closeModal} maxWidth="max-w-lg">
  <div className="px-10 py-6 text-lg">
    <h2 className="text-2xl font-semibold mb-4">Track Item</h2>
    <div className="space-y-4">
      {orderTrakingDetails?.events?.map((event, index) => {
        const isInProgress = index === inProgressIndex;

        return (
          <div key={index} className="relative flex items-start pb-6">
            {index !== orderTrakingDetails.events.length - 1 && (
              <div
                className={`absolute left-[0.55rem] top-6 h-[calc(100%-1rem)] w-0.5 
                  ${event.completed || isInProgress ? "bg-green-600" : "bg-gray-300"}`}
              ></div>
            )}

            {/* Event Marker */}
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 cursor-pointer ${
                event.completed
                  ? "bg-green-600"
                  : isInProgress
                  ? "bg-gray-200"
                  : "bg-gray-200"
              }`}
              title={
                event.completed
                  ? "Mark as incomplete"
                  : isInProgress
                  ? "Mark as complete"
                  : "Mark as complete"
              }
            >
              {isInProgress ? (
                // In-progress dot
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              ) : (
                // Checkmark for completed or not completed
                <FaCheck
                  size={13}
                  className={
                    event.completed ? "text-white" : "text-gray-500"
                  }
                />
              )}
            </div>

            <div>
              {event.status === "Arriving: by April, 19 Apr" ? (
                <div className="rounded-md">
                  <p className="font-medium">{event.status}</p>
                  <p className="text-sm text-gray-600">{event.details}</p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">
                    {event.time && `${event.time}: `}
                    {event.status !== "Shipped: Tomorrow" ? (
                      event.status === "Order Placed"
                        ? event.status + ": " + event.date
                        : event.status
                    ) : (
                      <span>Shipped: Tomorrow</span>
                    )}
                  </p>

                  {event.status === "Shipped: Tomorrow" && (
                    <p className="text-2xl text-gray-500 mt-8">
                      {orderTrakingDetails.shipped_date}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
</CommonModel>
    </div>
  );
};

export default TrackingModalPage;
