"use client";
import React, { createContext, useState, useContext } from "react";
const ShopByCallectionContext = createContext();

export const useShopByCallection = () => useContext(ShopByCallectionContext);

export const ShopByCallectionProvider = ({ children }) => {
  const [shopBy, setShopBy] = useState(null);

  console.log("context======", shopBy);
  
  return (
    <ShopByCallectionContext.Provider
      value={{
        shopBy,
        setShopBy,
      }}
    >
      {children}
    </ShopByCallectionContext.Provider>
  );
};
