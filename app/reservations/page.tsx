import React from "react";

import EmptyState from "@/components/EmptyState";
import Heading from "@/components/Heading";

import { getCurrentUser } from "@/services/user";
import { getFavorites } from "@/services/favorite";
import parkingsData from "@/data/parkings.json";
import reservationsData from "@/data/reservations.json";
import ReservationsClient from "./_components/ReservationsClient";

const ReservationPage = async () => {
  const user = await getCurrentUser();
  const favorites = await getFavorites();

  if (!user) return <EmptyState title="No autorizado" subtitle="Por favor inicia sesión" />;

  // MOCK: Mostrar reservas en "mis parkings" (parkings 1-8)
  const myParkingIds = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const reservationsInMyParkings = reservationsData.reservations
    .filter(r => myParkingIds.includes(r.listingId))
    .slice(0, 8);
  
  const listings = reservationsInMyParkings.map(reservation => {
    const parking = parkingsData.parkings.find(p => p.id === reservation.listingId);
    if (!parking) return null;
    
    return {
      ...parking,
      reservation: reservation,
    };
  }).filter(Boolean);

  if (listings.length === 0)
    return (
      <EmptyState
        title="No hay reservas"
        subtitle="Aún no tienes reservas en tus estacionamientos."
      />
    );

  return (
    <section className="main-container">
      <Heading title="Reservas Recibidas" subtitle="Reservas en tus parkings" backBtn/>
      <ReservationsClient listings={listings} favorites={favorites} currentUserId={user.id} />
    </section>
  );
};

export default ReservationPage;
