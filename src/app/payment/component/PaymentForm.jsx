"use client";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BsApple } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { GrPaypal } from "react-icons/gr";
import AddCardModel from "./AddCardModel";
import creditCardType from "credit-card-type";
import {
  createCard,
  fetchCard,
  deleteCard,
  updateCard,
} from "@/forntend/services/cardServies";
import Loading from "@/components/Loading";

function PaymentForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const detectCardType = (cardNumber) => {
    const cleaned = cardNumber?.toString()?.replace(/\s+/g, "");
    const cardInfo = creditCardType(cleaned);
    return cardInfo.length > 0 ? cardInfo[0].type : "visa";
  };

  const formatCardNumber = (cardNumber) => {
    const cleaned = cardNumber?.toString()?.replace(/\s+/g, "");
    return cleaned?.replace(/(\d{4})/g, "$1 ").trim();
  };

  const handleAddCard = async (newCard) => {
    try {
      const response = await createCard({
        cardNumber: newCard.cardNumber,
        cardName: newCard.cardName,
        cvv: newCard.cvv,
        cardExpirationDate: newCard.expirationDate,
      });
      if (response?.isSuccess) {
        const addedCard = response.data;

        const formattedCardNumber = formatCardNumber(addedCard.cardNumber);
        const cardType = detectCardType(formattedCardNumber);

        const formattedCard = {
          id: addedCard._id,
          type: cardType,
          cardNumber: formattedCardNumber,
          lastFour: formattedCardNumber.slice(-4),
          cardName: addedCard.cardName,
          cvv: addedCard.cvv,
          expiryDate: addedCard.cardExpirationDate,
          isDefault: false,
        };

        setCards([...cards, formattedCard]);
        setSelectedCard(addedCard._id);
      }
    } catch (error) {
      console.error("Error adding card:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleEditCard = async (updatedCard) => {
    try {
      const response = await updateCard({
        _id: editingCard.id,
        cardNumber: updatedCard.cardNumber,
        cardName: updatedCard.cardName,
        cvv: updatedCard.cvv,
        cardExpirationDate: updatedCard.expirationDate,
      });

      if (response.isSuccess) {
        const formattedCardNumber = formatCardNumber(updatedCard.cardNumber);
        const cardType = detectCardType(formattedCardNumber);

        console.log("cardscardscardscards===", cards, editingCard.id);
        console.log(
          "updatedCard.cardNumber=====",
          updatedCard,
          formattedCardNumber
        );

        setCards(
          cards.map((card) =>
            card.id == editingCard.id
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
      }
    } catch (error) {
      console.error("Error updating card:", error);
    } finally {
      setEditingCard(null);
      setIsModalOpen(false);
    }
  };

  const handleRemoveCard = async (cardId) => {
    try {
      const response = await deleteCard(cardId);

      if (response.isSuccess) {
        const newCards = cards.filter((card) => card.id !== cardId);
        setCards(newCards);

        if (selectedCard === cardId) {
          setSelectedCard(newCards.length > 0 ? newCards[0].id : null);
        }
      }
    } catch (error) {
      console.error("Error deleting card:", error);
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
      cardNumber: card.cardNumber.replace(/\s+/g, ""),
      expirationDate: card.expiryDate,
      cvv: card.cvv,
      cardName: card.cardName,
      useShippingAddress: false,
    });
    setIsModalOpen(true);
  };

  const formatCardsFromAPI = (apiCards) => {
    return apiCards.map((card) => {
      const formattedCardNumber = formatCardNumber(card.cardNumber);
      const cardType = detectCardType(formattedCardNumber);

      return {
        id: card._id,
        type: cardType,
        cardNumber: formattedCardNumber,
        lastFour: formattedCardNumber.slice(-4),
        cardName: card.cardName,
        cvv: card.cvv,
        expiryDate: card.cardExpirationDate,
        isDefault: false,
      };
    });
  };

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetchCard();

        if (response?.isSuccess && response.data) {
          const formattedCards = formatCardsFromAPI(response.data);
          setCards(formattedCards);

          if (formattedCards.length > 0) {
            setSelectedCard(formattedCards[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardDetails();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

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
                            alt={`${card.type} card`}
                            fill
                            className="object-over p-1 rounded-full"
                          />
                        </div>
                      </div>
                      <div className="ps-3 sm:ps-10">
                        <p className="pb-2">{card.cardName}</p>
                        <p>{`**** **** **** ${card.lastFour}`}</p>
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
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedCard === "apple"}
                    onChange={() => setSelectedCard("apple")}
                  />
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