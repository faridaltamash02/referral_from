import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient, { setupInterceptors } from '../apiService'; // Import Axios and interceptor setup

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => {
    setLoading((prevLoading) => {
      if (!prevLoading) {
        return true; // Set to true only if it was previously false
      }
      return prevLoading; // Prevent unnecessary re-renders
    });
  };
  const hideLoader = () => setLoading(false);

  useEffect(() => {
    setupInterceptors({ showLoader, hideLoader });
  }, []);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};
