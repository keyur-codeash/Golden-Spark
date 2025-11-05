import { useState } from 'react';

const useToken = (key = 'token') => {
  const [token, setTokenState] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem(key));
    }
    return null;
  });

  const setToken = (newToken) => {
    localStorage.setItem(key, JSON.stringify(newToken));
    setTokenState(newToken);
  };

  const removeToken = () => {
    console.log(key);
    
    localStorage.removeItem(key);
    setTokenState(null);
  };
  

  return {
    token,
    setToken,
    removeToken,
  };
};

export default useToken;
