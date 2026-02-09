import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmailWithPassword } from "@/services/user";

const providers: any[] = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Email y contraseña son requeridos");
      }

      const user = getUserByEmailWithPassword(credentials.email);

      if (!user) {
        throw new Error("Email o contraseña incorrectos");
      }

      const passwordMatch = await bcrypt.compare(
        credentials.password,
        user.password
      );

      if (!passwordMatch) {
        throw new Error("Email o contraseña incorrectos");
      }

      // Retornar usuario sin contraseña
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    },
  }),
];

export const authOptions: AuthOptions = {
  providers,
  callbacks: {
    async session({ token, session }) {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub || token.id,
            name: token.name,
            email: token.email,
            image: (token.picture || token.image) as string | null | undefined,
          },
        };
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
