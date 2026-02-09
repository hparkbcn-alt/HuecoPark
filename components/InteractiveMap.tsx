"use client";

import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  price: number;
  imageSrc: string;
  latlng: number[];
  category: string;
  reservations?: any[];
}

interface InteractiveMapProps {
  listings: Listing[];
}

const BARCELONA_CENTER: L.LatLngExpression = [41.3874, 2.1686];

// Custom icons
const createCustomIcon = (color: "green" | "red") => {
  return L.divIcon({
    html: `<div style="background-color: ${color === "green" ? "#10b981" : "#ef4444"}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: "custom-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ listings }) => {
  const [filter, setFilter] = useState<"all" | "available" | "occupied" | "libre-pronto">("all");
  const [priceRange, setPriceRange] = useState<"all" | "economico" | "moderado" | "premium">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safety check
  if (!Array.isArray(listings)) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">Error al cargar los parkings</p>
      </div>
    );
  }

  // Obtener categorías únicas
  const categories = Array.from(new Set(listings.map(l => l.category)));

  const isAvailable = (listing: Listing) => {
    if (!listing.reservations || listing.reservations.length === 0) return true;
    
    const now = new Date();
    return !listing.reservations.some((res: any) => {
      const start = new Date(res.startDate);
      const end = new Date(res.endDate);
      return now >= start && now <= end;
    });
  };

  const getActiveReservation = (listing: Listing) => {
    if (!listing.reservations || listing.reservations.length === 0) return null;
    
    const now = new Date();
    return listing.reservations.find((res: any) => {
      const start = new Date(res.startDate);
      const end = new Date(res.endDate);
      return now >= start && now <= end;
    }) || null;
  };

  const willBeFreeIn30Min = (listing: Listing) => {
    const activeRes = getActiveReservation(listing);
    if (!activeRes) return false;
    
    const now = new Date();
    const endDate = new Date(activeRes.endDate);
    const diffInMs = endDate.getTime() - now.getTime();
    const diffInMin = diffInMs / 1000 / 60;
    
    return diffInMin > 0 && diffInMin <= 30;
  };

  const formatEndTime = (reservation: any) => {
    const endDate = new Date(reservation.endDate);
    const hours = endDate.getHours().toString().padStart(2, '0');
    const minutes = endDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const filteredListings = listings.filter((listing) => {
    // Filtro por disponibilidad
    let passesAvailabilityFilter = true;
    if (filter === "available") passesAvailabilityFilter = isAvailable(listing);
    if (filter === "occupied") passesAvailabilityFilter = !isAvailable(listing);
    if (filter === "libre-pronto") passesAvailabilityFilter = willBeFreeIn30Min(listing);
    
    // Filtro por precio
    let passesPriceFilter = true;
    if (priceRange === "economico") passesPriceFilter = listing.price < 5;
    if (priceRange === "moderado") passesPriceFilter = listing.price >= 5 && listing.price <= 10;
    if (priceRange === "premium") passesPriceFilter = listing.price > 10;
    
    // Filtro por categoría
    let passesCategoryFilter = true;
    if (categoryFilter !== "all") passesCategoryFilter = listing.category === categoryFilter;
    
    return passesAvailabilityFilter && passesPriceFilter && passesCategoryFilter;
  });

  const openGoogleMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  if (!mounted) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros de Disponibilidad */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Disponibilidad</h3>
        <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Todos ({listings.length})
        </button>
        <button
          onClick={() => setFilter("available")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "available"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Disponibles ({listings.filter((l) => isAvailable(l)).length})
        </button>
        <button
          onClick={() => setFilter("occupied")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "occupied"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          Ocupados ({listings.filter((l) => !isAvailable(l)).length})
        </button>
        <button
          onClick={() => setFilter("libre-pronto")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "libre-pronto"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          ⏰ Libre en 30min ({listings.filter((l) => willBeFreeIn30Min(l)).length})
        </button>
      </div>
      </div>

      {/* Filtros de Precio */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Rango de Precio</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setPriceRange("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              priceRange === "all"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todos los precios ({listings.length})
          </button>
          <button
            onClick={() => setPriceRange("economico")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              priceRange === "economico"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            💰 Económico (&lt; 5€) ({listings.filter((l) => l.price < 5).length})
          </button>
          <button
            onClick={() => setPriceRange("moderado")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              priceRange === "moderado"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            💎 Moderado (5-10€) ({listings.filter((l) => l.price >= 5 && l.price <= 10).length})
          </button>
          <button
            onClick={() => setPriceRange("premium")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              priceRange === "premium"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            ⭐ Premium (&gt; 10€) ({listings.filter((l) => l.price > 10).length})
          </button>
        </div>
      </div>

      {/* Filtros de Categoría */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Tipo de Parking</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              categoryFilter === "all"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Todos los tipos ({listings.length})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                categoryFilter === category
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category} ({listings.filter((l) => l.category === category).length})
            </button>
          ))}
        </div>
      </div>

      {/* Mapa */}
      <MapContainer
        center={BARCELONA_CENTER}
        zoom={13}
        scrollWheelZoom={true}
        className="h-[600px] rounded-lg z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {filteredListings.map((listing) => {
          const available = isAvailable(listing);
          const activeRes = getActiveReservation(listing);
          const icon = createCustomIcon(available ? "green" : "red");
          
          return (
            <Marker
              key={listing.id}
              position={listing.latlng as L.LatLngExpression}
              icon={icon}
            >
              <Popup>
                <div className="p-2 min-w-[250px]">
                  <img
                    src={listing.imageSrc}
                    alt={listing.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-semibold text-base mb-1">{listing.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {listing.category} • {listing.price}€/hora
                  </p>
                  <div
                    className={`text-sm font-medium mb-1 ${
                      available ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {available ? "✓ Disponible" : "✗ Ocupado"}
                  </div>
                  {!available && activeRes && (
                    <div className="text-xs text-orange-600 font-medium mb-3">
                      🕒 Quedará libre a las {formatEndTime(activeRes)}
                    </div>
                  )}
                  {available && !activeRes && (
                    <div className="mb-2"></div>
                  )}
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => openGoogleMaps(listing.latlng[0], listing.latlng[1])}
                      className="w-full bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Cómo llegar
                    </button>
                    
                    <Link href={`/listings/${listing.id}`}>
                      <button className="w-full bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 text-sm font-medium">
                        {available ? "Ver y Reservar" : "Ver detalles"}
                      </button>
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Leyenda */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow"></div>
          <span>Ocupado</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
