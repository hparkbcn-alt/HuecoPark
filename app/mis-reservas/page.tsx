import React from "react";

import EmptyState from "@/components/EmptyState";
import Heading from "@/components/Heading";

import { getCurrentUser } from "@/services/user";
import { getFavorites } from "@/services/favorite";
import parkingsData from "@/data/parkings.json";
import reservationsData from "@/data/reservations.json";
import MisReservasClient from "./_components/MisReservasClient";

const MisReservasPage = async () => {
  const user = await getCurrentUser();
  const favorites = await getFavorites();

  if (!user) {
    return <EmptyState title="No autorizado" subtitle="Por favor inicia sesión" />;
  }

  // MOCK: Mostrar primeras 6 reservas como ejemplo
  const mockReservations = reservationsData.reservations.slice(0, 6);
  
  const listings = mockReservations
    .map(reservation => {
      const parking = parkingsData.parkings.find(p => p.id === reservation.listingId);
      if (!parking) return null;
      
      return {
        ...parking,
        reservation: reservation,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (listings.length === 0) {
    return (
      <EmptyState
        title="No tienes reservas"
        subtitle="Aún no has reservado ningún estacionamiento."
      />
    );
  }

  return (
    <section className="main-container">
      <Heading
        title="Mis Reservas"
        subtitle="Historial de estacionamientos reservados"
        backBtn
      />
      <MisReservasClient listings={listings} favorites={favorites} currentUserId={user.id} />
    </section>
  );
};

export default MisReservasPage;
