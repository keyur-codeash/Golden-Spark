"use client";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Image from "next/image";
import React, { useState } from "react";
import { BsApple } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { GrPaypal } from "react-icons/gr";
import AddCardModel from "./AddCardModel";
import creditCardType from "credit-card-type";

function PaymentForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cards, setCards] = useState([
    {
      id: "1",
      type: "visa",
      cardNumber: "4111 1111 1111 1111",
      lastFour: "1111",
      cardName: "John Doe",
      cvv: "123",
      expiryDate: "12/25",
      isDefault: true,
    },
    {
      id: "2",
      type: "mastercard",
      cardNumber: "5555 5555 5555 4444",
      lastFour: "4444",
      cardName: "John Doe",
      cvv: "456",
      expiryDate: "06/24",
      isDefault: false,
    },
  ]);
  const [selectedCard, setSelectedCard] = useState("1");
  const [editingCard, setEditingCard] = useState(null);

  const detectCardType = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s+/g, "");
    const cardInfo = creditCardType(cleaned);
    return cardInfo.length > 0 ? cardInfo[0].type : "visa";
  };

  const formatCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s+/g, "");
    return cleaned.replace(/(\d{4})/g, "$1 ").trim();
  };

  const handleAddCard = (newCard) => {
    const cardId = Date.now().toString();
    const formattedCardNumber = formatCardNumber(newCard.cardNumber);
    const cardType = detectCardType(formattedCardNumber);

    setCards([
      ...cards,
      {
        id: cardId,
        type: cardType,
        cardNumber: formattedCardNumber,
        lastFour: formattedCardNumber.slice(-4),
        cardName: newCard.cardName,
        cvv: newCard.cvv,
        expiryDate: newCard.expirationDate,
        isDefault: false,
      },
    ]);
    setSelectedCard(cardId);
    setIsModalOpen(false);
  };

  const handleEditCard = (updatedCard) => {
    const formattedCardNumber = formatCardNumber(updatedCard.cardNumber);
    const cardType = detectCardType(formattedCardNumber);

    setCards(
      cards.map((card) =>
        card.id === editingCard.id
          ? {
              ...card,
              type: cardType,
              cardNumber: formattedCardNumber,
              lastFour: formattedCardNumber.slice(-4),
              cardName: updatedCard.cardName,
              cvv: updatedCard.cvv,
              expiryDate: updatedCard.expirationDate,
            }
          : card
      )
    );
    setEditingCard(null);
    setIsModalOpen(false);
  };

  const handleRemoveCard = (cardId) => {
    const newCards = cards.filter((card) => card.id !== cardId);
    setCards(newCards);

    if (selectedCard === cardId) {
      setSelectedCard(newCards.length > 0 ? newCards[0].id : null);
    }
  };

  const handleSetDefault = (cardId) => {
    setCards(
      cards.map((card) => ({
        ...card,
        isDefault: card.id === cardId,
      }))
    );
    setSelectedCard(cardId);
  };

  const openEditModal = (card) => {
    setEditingCard({
      id: card.id,
      cardNumber: card.cardNumber,
      expirationDate: card.expiryDate,
      cvv: card.cvv,
      cardName: card.cardName,
      useShippingAddress: false,
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <AddCardModel
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        editingCard={editingCard}
        onAddCard={handleAddCard}
        onEditCard={handleEditCard}
      />

      <div className="border-b pb-7 border-gray-300">
        <Heading className="text-start !px-0">Payment Method</Heading>
      </div>

      <div>
        <ul className="text-md sm:text-xl">
          <li className="py-5 px-3 sm:px-0 border-b border-gray-300 ">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="relative w-10 h-10 ">
                  <Image
                    src="./icons/cashOnDelavry.svg"
                    alt="Cash on delivery"
                    fill
                    className="object-center rounded-lg"
                  />
                </div>
                <p className="ps-5">Cash On Delivery</p>
              </div>
              <input
                type="radio"
                name="payment"
                checked={selectedCard === "cash"}
                onChange={() => setSelectedCard("cash")}
              />
            </div>
          </li>

          <li className="py-5">
            <div className="flex px-3 sm:px-0 justify-between items-center">
              <div className="flex items-center">
                <div className="relative w-10 h-10 ">
                  <Image
                    src="./icons/card.svg"
                    alt="Credit card"
                    fill
                    className="object-center rounded-lg"
                  />
                </div>
                <p className="ps-5">Credit And Debit Card</p>
              </div>
            </div>

            <ul className="sm:ps-14 xl:ps-16 2xl:ps-18 pt-4">
              {cards.map((card) => (
                <li key={card.id} className="border-b border-gray-300">
                  <div className="py-4 flex justify-between">
                    <div className="flex items-start">
                      <div>
                        <div className="relative w-12 h-12 bg-gray-300 rounded-full">
                          <Image
                            src={`/icons/cards/payment-${card.type}.svg`}
                            // src={`/icon/amarican.svg`}
                            alt={`${card.type} card`}
                            fill
                            className="object-over p-1 rounded-full"
                          />
                        </div>
                      </div>
                      <div className="ps-3 sm:ps-10">
                        <p className="pb-2">{card.cardName}</p>
                        <p>{`**** **** **** ${card.cardNumber.slice(-4)}`}</p>
                      </div>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedCard === card.id}
                        onChange={() => handleSetDefault(card.id)}
                      />
                    </div>
                  </div>
                </li>
              ))}

              <li>
                <div className="pt-7">
                  {cards.length > 0 && selectedCard !== "cash" && (
                    <>
                      <Button
                        label="REMOVE"
                        variant="outline"
                        className="px-3 py-3 border !text-black border-black"
                        onClick={() => handleRemoveCard(selectedCard)}
                      />
                      <Button
                        label="EDIT"
                        variant="solid"
                        className="px-10 py-3 border border-yellow-800 !bg-yellow-800 ms-5"
                        onClick={() =>
                          openEditModal(
                            cards.find((c) => c.id === selectedCard)
                          )
                        }
                      />
                    </>
                  )}
                </div>
              </li>
            </ul>
          </li>

          <li>
            <p
              className="border border-dotted p-2 sm:p-3 cursor-pointer rounded-md"
              onClick={() => {
                setEditingCard(null);
                setIsModalOpen(true);
              }}
            >
              + Add New Card
            </p>
          </li>
        </ul>

        <div>
          <div>
            <h2 className="text-2xl font-medium py-5">More Payment Options</h2>
          </div>
          <div>
            <ul className="text-xl">
              <li className="border border-gray-300 p-2.5 rounded-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div>
                      <BsApple size={25} />
                    </div>
                    <p className="ps-2">Apple Pay</p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedCard === "apple"}
                      onChange={() => setSelectedCard("apple")}
                    />
                  </div>
                </div>
              </li>

              <li className="border border-gray-300 p-2.5 rounded-sm mt-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div>
                      <FcGoogle size={25} />
                    </div>
                    <p className="ps-2">Google Pay</p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedCard === "google"}
                      onChange={() => setSelectedCard("google")}
                    />
                  </div>
                </div>
              </li>

              <li className="border border-gray-300 p-2.5 rounded-sm mt-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div>
                      <GrPaypal size={25} className="text-custom-blue-700" />
                    </div>
                    <p className="ps-2">Paypal Pay</p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedCard === "paypal"}
                      onChange={() => setSelectedCard("paypal")}
                    />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentForm;
