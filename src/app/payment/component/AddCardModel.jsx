"use client";
import InputField from "@/components/Input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PiLockKeyThin } from "react-icons/pi";
import { GoQuestion } from "react-icons/go";
import Button from "@/components/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import creditCardType from "credit-card-type";

const cardImage = [
  "/images/payment_card_one.png",
  "/images/payment_card_two.png",
  "/images/payment_card_three.png",
  "/images/payment_card_four.png",
];

const AddCardModel = ({
  isModalOpen,
  setIsModalOpen,
  editingCard,
  onAddCard,
  onEditCard,
}) => {
  const [expirationDate, setExpirationDate] = useState(null);
  const [cardType, setCardType] = useState("visa");

  const formik = useFormik({
    initialValues: {
      cardNumber: "",
      expirationDate: "",
      cvv: "",
      cardName: "",
      useShippingAddress: false,
    },
    validationSchema: Yup.object({
      cardNumber: Yup.string()
        .required("Card number is required")
        .matches(/^\d{12,19}$/, "Card number must be between 12 and 19 digits"),
      expirationDate: Yup.string()
        .required("Expiration date is required")
        .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Must be in MM/YY format")
        .test("expirationDate", "Card has expired", function (value) {
          if (!value) return false;
          const [month, year] = value.split("/");
          const expiration = new Date(`20${year}`, month - 1);
          const currentDate = new Date();
          return expiration >= currentDate;
        }),
      cvv: Yup.string()
        .required("CVV is required")
        .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
      cardName: Yup.string().required("Card name is required"),
    }),
    onSubmit: (values) => {
      if (editingCard) {
        onEditCard(values);
      } else {
        onAddCard(values);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isModalOpen && editingCard) {
      const [month, year] = editingCard.expirationDate.split("/");
      const date = new Date(`20${year}`, month - 1);
      setExpirationDate(date);

      formik.setValues({
        cardNumber: editingCard.cardNumber.replace(/\s+/g, ""),
        expirationDate: editingCard.expirationDate,
        cvv: editingCard.cvv,
        cardName: editingCard.cardName,
        useShippingAddress: false,
      });
    } else if (isModalOpen) {
      setExpirationDate(null);
      formik.resetForm();
    }
  }, [isModalOpen, editingCard]);

  useEffect(() => {
    if (formik.values.cardNumber.length >= 4) {
      const cardInfo = creditCardType(formik.values.cardNumber);
      setCardType(cardInfo.length > 0 ? cardInfo[0].type : "visa");
    }
  }, [formik.values.cardNumber]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const handleDateChange = (date) => {
    if (!date) {
      setExpirationDate(null);
      formik.setFieldValue("expirationDate", "");
      return;
    }
    setExpirationDate(date);
    const formattedDate = `${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getFullYear()).slice(-2)}`;
    formik.setFieldValue("expirationDate", formattedDate, true);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 19);
    formik.setFieldValue("cardNumber", value);
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black-200 bg-opacity-50 h-screen"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="bg-yellow-400 rounded-lg lg:w-1/2 xl:w-3xl max-h-[90vh] w-lg overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div>
            <div className="border-1 border-yellow-50 rounded-sm">
              <div className="bg-black text-white px-5 py-4 rounded-t-lg ">
                <div className="md:flex justify-between items-center">
                  <p className="text-2xl">
                    {editingCard ? "Edit Card" : "Add New Card"}
                  </p>
                  <div className="flex">
                    {cardImage.map((item, index) => (
                      <div
                        key={index}
                        className="relative w-16 h-11 rounded-sm sm:mx-1"
                      >
                        <Image
                          src={item}
                          alt="Credit card"
                          fill
                          className="object-center p-1 rounded-sm"
                        />
                      </div>
                    ))}
                  </div>
                  {/* <div className="relative w-16 h-11 rounded-sm">
                    <Image
                      src={cardImage[cardType] || "/icons/visaCard.svg"}
                      alt="Credit card"
                      fill
                      className="object-center p-1 rounded-sm"
                    />
                  </div> */}
                </div>
              </div>
              <form className="p-5" onSubmit={formik.handleSubmit}>
                <div>
                  <InputField
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="Card Number"
                    className="bg-white"
                    value={formik.values.cardNumber.replace(
                      /(\d{4})(?=\d)/g,
                      "$1 "
                    )}
                    onChange={handleCardNumberChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.cardNumber && formik.errors.cardNumber
                    }
                    rightIcon={
                      <PiLockKeyThin size={22} className="text-gray-500" />
                    }
                  />
                </div>

                <div className="flex w-full mt-4">
                  <div className="w-full">
                    <DatePicker
                      selected={expirationDate}
                      onChange={handleDateChange}
                      dateFormat="MM/yy"
                      showMonthYearPicker
                      minDate={new Date()}
                      placeholderText="Expiration date (MM/YY)"
                      wrapperClassName="w-full"
                      className={`bg-white w-full p-2 border py-3 rounded-md ${
                        formik.touched.expirationDate &&
                        formik.errors.expirationDate
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.expirationDate &&
                      formik.errors.expirationDate && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.expirationDate}
                        </div>
                      )}
                  </div>
                  <div className="w-full ps-7">
                    <InputField
                      id="cvv"
                      name="cvv"
                      placeholder="Security Code"
                      value={formik.values.cvv}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.cvv && formik.errors.cvv}
                      rightIcon={
                        <GoQuestion size={24} className="text-gray-400" />
                      }
                      className="bg-white w-full"
                    />
                  </div>
                </div>

                <div>
                  <InputField
                    id="cardName"
                    name="cardName"
                    placeholder="Name on Card"
                    value={formik.values.cardName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.cardName && formik.errors.cardName}
                    className="bg-white w-full"
                  />
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2 text-lg">
                    <input
                      type="checkbox"
                      id="useShippingAddress"
                      name="useShippingAddress"
                      checked={formik.values.useShippingAddress}
                      onChange={formik.handleChange}
                      className="custom-checkbox"
                    />
                    Use shipping address as billing address
                  </label>
                </div>

                <div className="flex gap-4 sm:px-10 pb-5">
                  <Button
                    type="button"
                    label="CANCEL"
                    color="blue"
                    size="md"
                    variant="outline"
                    className="!text-black w-full py-3 mt-5 flex items-center gap-[10px]"
                    onClick={() => setIsModalOpen(false)}
                  />
                  <Button
                    type="submit"
                    label={editingCard ? "UPDATE CARD" : "SAVE CARD"}
                    color="blue"
                    size="md"
                    variant="solid"
                    className="!bg-yellow-800 w-full py-3 border border-yellow-800 mt-5 flex items-center gap-[10px]"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCardModel;