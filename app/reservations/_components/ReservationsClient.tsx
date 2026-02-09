"use client";

import React, { useState, useMemo } from "react";
import ListingCard from "@/components/ListingCard";
import ListingDetailsModal from "@/components/modals/ListingDetailsModal";

interface ReservationsClientProps {
  listings: any[];
  favorites: string[];
  currentUserId: string;
}

type TabType = "pending" | "accepted" | "active" | "completed" | "history";

// Mock de nombres de usuarios para las reservas
const getUserName = (userId: string): string => {
  const names: { [key: string]: string } = {
    "user-demo-1": "Carlos Rodríguez",
    "user-demo-2": "María González",
    "user-demo-3": "Juan Martínez",
    "user-demo-4": "Ana López",
    "user-demo-5": "Pedro Sánchez",
  };
  return names[userId] || "Usuario Demo";
};

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  listings,
  favorites,
  currentUserId,
}) => {
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  const now = new Date();

  // Clasificar reservas según su estado
  const classifiedReservations = useMemo(() => {
    const pending: any[] = [];
    const accepted: any[] = [];
    const active: any[] = [];
    const completed: any[] = [];
    const history: any[] = [];

    listings.forEach((listing) => {
      const reservation = listing.reservation;
      const startDate = new Date(reservation.startDate);
      const endDate = new Date(reservation.endDate);
      // Si no tiene status, se considera "pending"
      const status = reservation.status || "pending";

      if (status === "pending") {
        pending.push(listing);
      } else if (status === "accepted") {
        // Si ya empezó pero no ha terminado -> activa
        if (startDate <= now && endDate > now) {
          active.push(listing);
        }
        // Si ya terminó -> completada e historial
        else if (endDate <= now) {
          completed.push(listing);
          history.push(listing);
        }
        // Si aún no empieza -> aceptada (futura)
        else {
          accepted.push(listing);
        }
      } else if (status === "in-progress") {
        // Reservas que el usuario ya ha ingresado (checked_in)
        active.push(listing);
      } else if (status === "completed") {
        completed.push(listing);
        history.push(listing);
      } else if (status === "rejected" || status === "cancelled") {
        history.push(listing);
      }
    });

    return { pending, accepted, active, completed, history };
  }, [listings, now]);

  const getCurrentListings = () => {
    switch (activeTab) {
      case "pending":
        return classifiedReservations.pending;
      case "accepted":
        return classifiedReservations.accepted;
      case "active":
        return classifiedReservations.active;
      case "completed":
        return classifiedReservations.completed;
      case "history":
        return classifiedReservations.history;
      default:
        return [];
    }
  };

  const currentListings = getCurrentListings();

  const handleOpenModal = (listing: any) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedListing(null);
  };

  const tabs = [
    { id: "pending" as TabType, label: "Pendientes", count: classifiedReservations.pending.length, color: "yellow" },
    { id: "accepted" as TabType, label: "Aceptadas", count: classifiedReservations.accepted.length, color: "blue" },
    { id: "active" as TabType, label: "En Proceso", count: classifiedReservations.active.length, color: "green" },
    { id: "completed" as TabType, label: "Finalizadas", count: classifiedReservations.completed.length, color: "gray" },
    { id: "history" as TabType, label: "Historial", count: classifiedReservations.history.length, color: "purple" },
  ];

  const getTabColorClasses = (tabColor: string, isActive: boolean) => {
    if (isActive) {
      switch (tabColor) {
        case "yellow": return "bg-yellow-500 text-white";
        case "blue": return "bg-blue-500 text-white";
        case "green": return "bg-green-500 text-white";
        case "gray": return "bg-gray-500 text-white";
        case "purple": return "bg-purple-500 text-white";
        default: return "bg-gray-500 text-white";
      }
    } else {
      return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 rounded-t-lg font-medium text-sm whitespace-nowrap transition-colors
                ${getTabColorClasses(tab.color, activeTab === tab.id)}
              `}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? "bg-white/20" : "bg-gray-200"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {currentListings.length === 0 ? (
        <div className="mt-10 text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            No hay reservas en esta categoría
          </p>
        </div>
      ) : (
        <div className="mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
          {currentListings.map((listing: any) => {
            const { reservation, ...data } = listing;
            const hasFavorited = favorites.includes(listing.id);
            return (
              <ListingCard
                key={listing.id}
                data={data}
                reservation={reservation}
                hasFavorited={hasFavorited}
                context="reservationReceived"
                onClick={() => handleOpenModal(listing)}
              />
            );
          })}
        </div>
      )}

      {selectedListing && selectedListing.reservation && (
        <ListingDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          listing={selectedListing}
          reservation={selectedListing.reservation}
          context="reservationReceived"
          currentUserId={currentUserId}
          reservationUserName={getUserName(selectedListing.reservation.userId)}
        />
      )}
    </>
  );
};

export default ReservationsClient;
