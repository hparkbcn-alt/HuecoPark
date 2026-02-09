"use server";

import bcrypt from "bcryptjs";
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

export const registerUser = async ({
  name,
  email,
  password: inputPassword,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const usersData = readUsers();

    // Verificar si el usuario ya existe
    const existingUser = usersData.users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      throw new Error("Ya existe una cuenta con este email");
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(inputPassword, 12);

    // Crear nuevo usuario
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      image: null,
      favoriteIds: [],
      createdAt: new Date().toISOString(),
    };

    // Agregar usuario al array
    usersData.users.push(newUser);

    // Guardar en el archivo
    writeUsers(usersData);

    return { success: true, message: "Usuario registrado exitosamente" };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
