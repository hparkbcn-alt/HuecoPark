"use client";

import { useLoading } from "@/contexts/LoadingContext";
import { useTransition } from "react";

/**
 * Hook para manejar operaciones asíncronas con loading global automático
 * 
 * @example
 * const { execute, isLoading } = useAsyncOperation();
 * 
 * const handleClick = async () => {
 *   await execute(async () => {
 *     // Tu operación asíncrona aquí
 *     await someApiCall();
 *   });
 * };
 */
export const useAsyncOperation = () => {
  const { startLoading, stopLoading } = useLoading();
  const [isPending, startTransition] = useTransition();

  const execute = async <T,>(
    operation: () => Promise<T>
  ): Promise<T | undefined> => {
    startLoading();
    try {
      const result = await operation();
      stopLoading();
      return result;
    } catch (error) {
      stopLoading();
      throw error;
    }
  };

  const executeWithTransition = (operation: () => void) => {
    startLoading();
    startTransition(() => {
      operation();
      setTimeout(() => {
        stopLoading();
      }, 100);
    });
  };

  return {
    execute,
    executeWithTransition,
    isLoading: isPending,
  };
};
