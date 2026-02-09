"use server";
import { revalidatePath } from "next/cache";
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
  const fileContent = fs.readFileSync(reservationsFilePath, "utf-8");
  return JSON.parse(fileContent);
};

const writeReservations = (data: ReservationsData) => {
  fs.writeFileSync(reservationsFilePath, JSON.stringify(data, null, 2), "utf-8");
};

export const getReservations = async (args: Record<string, string>) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        listings: [],
        nextCursor: null,
      };
    }

    const reservationsData = readReservations();
    const parkings = [...parkingsData.parkings];

    // Obtener reservas del usuario o reservas de sus parkings
    const { authorId, userId } = args;
    
    let userReservations: Reservation[] = [];
    
    if (authorId) {
      // Mis parkings reservados por otros
      const myParkings = parkings.filter(p => p.userId === currentUser.id);
      const myParkingIds = myParkings.map(p => p.id);
      userReservations = reservationsData.reservations.filter(r => 
        myParkingIds.includes(r.listingId)
      );
    } else if (userId) {
      // Mis reservas en parkings de otros
      userReservations = reservationsData.reservations.filter(r => 
        r.userId === currentUser.id
      );
    } else {
      // Todas mis reservas
      userReservations = reservationsData.reservations.filter(r => 
        r.userId === currentUser.id
      );
    }

    // Combinar con información del parking
    const listings = userReservations.map(reservation => {
      const parking = parkings.find(p => p.id === reservation.listingId);
      if (!parking) return null;
      
      return {
        ...parking,
        reservations: [reservation],
      };
    }).filter(Boolean);

    return {
      listings,
      nextCursor: null,
    };
  } catch (error: any) {
    console.log(error?.message);
    return {
      listings: [],
      nextCursor: null,
    };
  }
};

export const createReservation = async ({
  listingId,
  startDate,
  endDate,
  totalPrice,
  userId
}: {
  listingId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  totalPrice: number;
  userId: string
}) => {
  try {
    if (!listingId || !startDate || !endDate || !totalPrice)
      throw new Error("Invalid data");

    const reservationsData = readReservations();

    const newReservation: Reservation = {
      id: `reservation-${Date.now()}`,
      userId,
      listingId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalPrice,
      createdAt: new Date().toISOString(),
    };

    reservationsData.reservations.push(newReservation);
    writeReservations(reservationsData);
    
    revalidatePath(`/listings/${listingId}`);
    revalidatePath("/mis-reservas");
    revalidatePath("/reservations");

    return newReservation;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const deleteReservation = async (reservationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    if (!reservationId || typeof reservationId !== "string") {
      throw new Error("Invalid ID");
    }

    const reservationsData = readReservations();
    const reservationIndex = reservationsData.reservations.findIndex(
      r => r.id === reservationId
    );

    if (reservationIndex === -1) {
      throw new Error("Reservation not found");
    }

    // Verificar que el usuario es dueño de la reserva o del parking
    const reservation = reservationsData.reservations[reservationIndex];
    const parking = parkingsData.parkings.find(p => p.id === reservation.listingId);
    
    if (reservation.userId !== currentUser.id && parking?.userId !== currentUser.id) {
      throw new Error("Unauthorized");
    }

    reservationsData.reservations.splice(reservationIndex, 1);
    writeReservations(reservationsData);

    revalidatePath("/reservations");
    revalidatePath("/mis-reservas");

    return { id: reservationId };
  } catch (error: any) {
    throw new Error(error.message)
  }
};


export const createPaymentSession = async ({
  listingId,
  startDate,
  endDate,
  totalPrice,
}: {
  listingId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  totalPrice: number;
}) => {
  if (!listingId || !startDate || !endDate || !totalPrice)
    throw new Error("Invalid data");

  const listing = parkingsData.parkings.find(p => p.id === listingId);

  if(!listing) throw new Error("Parking no encontrado!");

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Por favor inicia sesión para reservar!");
  }

  // Demo: Crear reserva directamente sin Stripe
  const reservation = await createReservation({
    listingId,
    startDate,
    endDate,
    totalPrice,
    userId: user.id,
  });

  // Retornar URL de éxito
  return {
    url: `/mis-reservas`, // Redirigir a mis reservas después de reservar
    reservation,
  };
}
