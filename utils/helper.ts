import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-ES").format(price);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
