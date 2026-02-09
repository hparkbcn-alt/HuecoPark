"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);
  const pathname = usePathname();

  const startLoading = () => {
    setLoadingCount((prev) => prev + 1);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setLoadingCount((prev) => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) {
        setIsLoading(false);
      }
      return newCount;
    });
  };

  // Interceptar cambios de ruta
  useEffect(() => {
    startLoading();
    const timer = setTimeout(() => {
      stopLoading();
    }, 300);

    return () => {
      clearTimeout(timer);
      stopLoading();
    };
  }, [pathname]);

  // Interceptar fetch global
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      startLoading();
      try {
        const response = await originalFetch(...args);
        stopLoading();
        return response;
      } catch (error) {
        stopLoading();
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <LoadingContext.Provider
      value={{ isLoading, setIsLoading, startLoading, stopLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
