import React from "react";

import EmptyState from "@/components/EmptyState";
import Heading from "@/components/Heading";

import { getCurrentUser } from "@/services/user";
import { getFavorites } from "@/services/favorite";
import parkingsData from "@/data/parkings.json";
import PropertiesClient from "./_components/PropertiesClient";

const PropertiesPage = async () => {
  const user = await getCurrentUser();
  const favorites = await getFavorites();

  if (!user) {
    return <EmptyState title="No autorizado" subtitle="Por favor inicia sesión" />;
  }

  // MOCK: Mostrar primeros 8 parkings como "mis parkings"
  const listings = parkingsData.parkings.slice(0, 8);

  if (!listings || listings.length === 0) {
    return (
      <EmptyState
        title="No tienes parkings registrados"
        subtitle="Publica tu primer estacionamiento."
      />
    );
  }

  return (
    <section className="main-container">
      <Heading title="Mis Parkings" subtitle="Lista de tus estacionamientos" backBtn/>
      <PropertiesClient listings={listings} favorites={favorites} currentUserId={user.id} />
    </section>
  );
};

export default PropertiesPage;
