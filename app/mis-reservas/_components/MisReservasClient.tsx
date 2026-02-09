"use client";

import React, { useState } from "react";
import ListingCard from "@/components/ListingCard";
import ListingDetailsModal from "@/components/modals/ListingDetailsModal";

interface MisReservasClientProps {
  listings: any[];
  favorites: string[];
  currentUserId: string;
}

const MisReservasClient: React.FC<MisReservasClientProps> = ({
  listings,
  favorites,
  currentUserId,
}) => {
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (listing: any) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedListing(null);
  };

  return (
    <>
      <div className="mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
        {listings.map((listing: any) => {
          const { reservation, ...data } = listing;
          const hasFavorited = favorites.includes(listing.id);
          return (
            <ListingCard
              key={listing.id}
              data={data}
              reservation={reservation}
              hasFavorited={hasFavorited}
              context="myReservation"
              onClick={() => handleOpenModal(listing)}
            />
          );
        })}
      </div>

      {selectedListing && (
        <ListingDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          listing={selectedListing}
          reservation={selectedListing.reservation}
          context="myReservation"
          currentUserId={currentUserId}
        />
      )}
    </>
  );
};

export default MisReservasClient;
