"use client";

import React, { useState } from "react";
import ListingCard from "@/components/ListingCard";
import ListingDetailsModal from "@/components/modals/ListingDetailsModal";
import { Listing } from "@prisma/client";

interface PropertiesClientProps {
  listings: any[];
  favorites: string[];
  currentUserId: string;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
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
        {listings.map((listing) => {
          const hasFavorited = favorites.includes(listing.id);
          return (
            <ListingCard
              key={listing.id}
              data={listing}
              hasFavorited={hasFavorited}
              context="myProperty"
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
          context="myProperty"
          currentUserId={currentUserId}
        />
      )}
    </>
  );
};

export default PropertiesClient;
