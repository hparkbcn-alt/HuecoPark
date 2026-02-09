import React from "react";
import dynamic from "next/dynamic";
import { getAllListings } from "@/services/listing";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
});

export default async function MapPage() {
  const listings = await getAllListings();

  return (
    <div className="main-container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mapa de Parkings</h1>
        <p className="text-gray-600">
          Encuentra parkings disponibles en Barcelona en tiempo real
        </p>
      </div>

      <InteractiveMap listings={listings as any} />
    </div>
  );
}
