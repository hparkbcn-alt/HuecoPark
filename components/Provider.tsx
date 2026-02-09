"use client";
import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import {SessionProvider} from 'next-auth/react'
import { LoadingProvider } from "@/contexts/LoadingContext";
import GlobalLoading from "@/components/GlobalLoading";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <LoadingProvider>
          <GlobalLoading />
          <Toaster position="bottom-right"/>
          {children}
        </LoadingProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;
