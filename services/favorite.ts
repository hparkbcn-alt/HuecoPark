"use server";

import { getCurrentUser, updateUserFavorites } from "./user";
import { revalidatePath } from "next/cache";
import parkingsData from "@/data/parkings.json";
import fs from "fs";
import path from "path";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string | null;
  favoriteIds: string[];
  createdAt: string;
}

interface UsersData {
  users: User[];
}

const usersFilePath = path.join(process.cwd(), "data", "users.json");

const readUsers = (): UsersData => {
  const fileContent = fs.readFileSync(usersFilePath, "utf-8");
  return JSON.parse(fileContent);
};

export const getFavorites = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];
    
    const usersData = readUsers();
    const userData = usersData.users.find(u => u.id === user.id);
    
    return userData?.favoriteIds || [];
  } catch (error) {
    return [];
  }
};

export const updateFavorite = async ({
  listingId,
  favorite,
}: {
  listingId: string;
  favorite: boolean;
}) => {
  try {
    if (!listingId || typeof listingId !== "string") {
      throw new Error("Invalid ID");
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("¡Por favor inicia sesión para guardar favoritos!");
    }

    const favorites = await getFavorites();
    let newFavorites;
    let hasFavorited;

    if (!favorite) {
      newFavorites = favorites.filter((id) => id !== listingId);
      hasFavorited = false;
    } else {
      if (favorites.includes(listingId)) {
        newFavorites = [...favorites];
      } else {
        newFavorites = [listingId, ...favorites];
      }
      hasFavorited = true;
    }

    // Guardar en el archivo JSON
    updateUserFavorites(currentUser.id, newFavorites);

    revalidatePath("/");
    revalidatePath(`/listings/${listingId}`);
    revalidatePath("/favorites");

    return {
      hasFavorited,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getFavoriteListings = async () => {
  try {
    const favoriteIds = await getFavorites();
    const favorites = parkingsData.parkings
      .filter(p => favoriteIds.includes(p.id))
      .map(listing => ({
        ...listing,
        createdAt: new Date(listing.createdAt)
      }));
    return favorites;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
