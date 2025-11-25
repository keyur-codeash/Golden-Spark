import { useState } from 'react';

const useToken = (key = 'token') => {
  const [token, setTokenState] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem(key));
    }
    return null;
  });

  const setToken = (newToken) => {
      if (typeof window !== "undefined" && window.localStorage) {

    localStorage.setItem(key, JSON.stringify(newToken));
    setTokenState(newToken);
      }
  };

  const removeToken = () => {
      if (typeof window !== "undefined" && window.localStorage) {

    localStorage.removeItem(key);
    setTokenState(null);
      }
  };
  

  return {
    token,
    setToken,
    removeToken,
  };
};

export default useToken;
