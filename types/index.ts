import { IconType } from "react-icons";

export interface Category {
  label: string;
  icon: IconType;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string | null;
  favoriteIds: string[];
  createdAt: string;
}