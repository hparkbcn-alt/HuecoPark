"use client";

import { useLoading } from "@/contexts/LoadingContext";

export default function GlobalLoading() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-16 w-16 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
        </div>
        
        {/* Texto */}
        <div className="text-white text-lg font-semibold animate-pulse">
          Cargando...
        </div>
      </div>
    </div>
  );
}
