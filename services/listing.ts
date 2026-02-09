"use server";
import { LISTINGS_BATCH } from "@/utils/constants";
import { getCurrentUser } from "./user";
import parkingsData from "@/data/parkings.json";
import fs from "fs";
import path from "path";

interface Reservation {
  id: string;
  userId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
}

interface ReservationsData {
  reservations: Reservation[];
}

const reservationsFilePath = path.join(process.cwd(), "data", "reservations.json");

const readReservations = (): ReservationsData => {
  try {
    const fileContent = fs.readFileSync(reservationsFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading reservations:', error);
    return { reservations: [] };
  }
};

export const getListings = async (query?: {
  [key: string]: string | string[] | undefined | null;
}) => {
  try {
    const {
      userId,
      levelCount,
      capacity,
      country,
      zone,
      startDate,
      endDate,
      category,
      cursor,
    } = query || {};

    let filteredListings = [...parkingsData.parkings];

    // Aplicar filtros
    if (userId) {
      filteredListings = filteredListings.filter(l => l.userId === userId);
    }

    if (category) {
      filteredListings = filteredListings.filter(l => l.category === category);
    }

    if (levelCount) {
      filteredListings = filteredListings.filter(l => l.levelCount >= +levelCount);
    }

    if (capacity) {
      filteredListings = filteredListings.filter(l => l.capacity >= +capacity);
    }

    // Buscar por zona/barrio en Barcelona
    if (zone) {
      filteredListings = filteredListings.filter(l => {
        const region = l.region.toLowerCase();
        const searchZone = zone.toString().toLowerCase();
        return region.includes(searchZone) || l.title.toLowerCase().includes(searchZone);
      });
    }
    
    // Mantener compatibilidad con búsqueda por país (legacy)
    if (country && !zone) {
      filteredListings = filteredListings.filter(l => {
        const region = l.region.toLowerCase();
        const searchCountry = country.toString().toLowerCase();
        return region.includes(searchCountry) || l.title.toLowerCase().includes(searchCountry);
      });
    }

    // Ordenar por fecha de creación
    filteredListings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginación
    let startIndex = 0;
    if (cursor) {
      const cursorIndex = filteredListings.findIndex(l => l.id === cursor);
      startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    }

    const listings = filteredListings.slice(startIndex, startIndex + LISTINGS_BATCH);
    const nextCursor = 
      filteredListings.length > startIndex + LISTINGS_BATCH
        ? listings[listings.length - 1]?.id || null
        : null;

    // Cargar reservas y combinarlas con los listings
    const reservationsData = readReservations();
    const listingsWithReservations = listings.map(listing => {
      const listingReservations = reservationsData.reservations.filter(
        res => res.listingId === listing.id
      );
      return {
        ...listing,
        createdAt: new Date(listing.createdAt),
        reservations: listingReservations,
      };
    });

    return {
      listings: listingsWithReservations,
      nextCursor,
    };
  } catch (error) {
    return {
      listings: [],
      nextCursor: null,
    };
  }
};

export const getAllListings = async () => {
  try {
    const allListings = [...parkingsData.parkings];
    
    // Cargar reservas y combinarlas con todos los listings
    const reservationsData = readReservations();
    const listingsWithReservations = allListings.map(listing => {
      const listingReservations = reservationsData.reservations.filter(
        res => res.listingId === listing.id
      );
      return {
        ...listing,
        createdAt: new Date(listing.createdAt),
        reservations: listingReservations,
      };
    });

    return listingsWithReservations;
  } catch (error) {
    console.error('Error in getAllListings:', error);
    return [];
  }
};

export const getListingById = async (id: string) => {
  const listing = parkingsData.parkings.find(p => p.id === id);
  
  if (!listing) return null;
  
  // Cargar reservas para este listing
  const reservationsData = readReservations();
  const listingReservations = reservationsData.reservations.filter(
    res => res.listingId === id
  );
  
  // Simular la estructura con usuario
  return {
    ...listing,
    createdAt: new Date(listing.createdAt),
    user: {
      id: listing.userId,
      name: "Administrador",
      image: null,
    },
    reservations: listingReservations,
  };
};

export const createListing = async (data: { [x: string]: any }): Promise<{ id: string }> => {
  // Por ahora solo devolvemos un mensaje, ya que no tenemos DB
  // En producción esto debería guardar en la DB real
  throw new Error("Función de crear parking temporalmente deshabilitada. Usa los parkings precargados.");
};
