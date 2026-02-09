import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

const writeUsers = (data: UsersData) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), "utf-8");
};

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const getUserByEmail = (email: string): Omit<User, 'password'> | null => {
  const usersData = readUsers();
  const user = usersData.users.find((u) => u.email === email);
  
  if (!user) return null;
  
  // No devolver la contraseña
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUserByEmailWithPassword = (email: string): User | null => {
  const usersData = readUsers();
  return usersData.users.find((u) => u.email === email) || null;
};

export const getUserById = (id: string): Omit<User, 'password'> | null => {
  const usersData = readUsers();
  const user = usersData.users.find((u) => u.id === id);
  
  if (!user) return null;
  
  // No devolver la contraseña
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUserFavorites = (userId: string, favoriteIds: string[]) => {
  const usersData = readUsers();
  const userIndex = usersData.users.findIndex((u) => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error("Usuario no encontrado");
  }
  
  usersData.users[userIndex].favoriteIds = favoriteIds;
  writeUsers(usersData);
  
  const { password, ...userWithoutPassword } = usersData.users[userIndex];
  return userWithoutPassword;
};
