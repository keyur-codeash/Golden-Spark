"use client";
import React, { useEffect, useState } from "react";
import cardValidator from "card-validator";
import AOS from "aos";
import "aos/dist/aos.css";

const PaymentForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const numberValidation = cardValidator.number(cardNumber);
    const expiryValidation = cardValidator.expirationDate(expiry);
    const cvvValidation = cardValidator.cvv(cvv);

    const newErrors = {};
    if (!numberValidation.isValid) newErrors.cardNumber = "Invalid card number";
    if (!expiryValidation.isValid) newErrors.expiry = "Invalid expiration date";
    if (!cvvValidation.isValid) newErrors.cvv = "Invalid CVV";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      alert("All fields are valid! Ready to proceed.");
      // Proceed to payment API or further logic
    }
  };

  return (
    <div data-aos="fade-up">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Card Number:</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
          />
          {errors.cardNumber && (
            <p className="text-red-500">{errors.cardNumber}</p>
          )}
        </div>

        <div>
          <label>Expiry (MM/YY):</label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="MM/YY"
          />
          {errors.expiry && <p className="text-red-500">{errors.expiry}</p>}
        </div>

        <div>
          <label>CVV:</label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="123"
          />
          {errors.cvv && <p className="text-red-500">{errors.cvv}</p>}
        </div>

        <button type="submit">Validate</button>
      </form>
    </div>
  );
};

export default PaymentForm;
