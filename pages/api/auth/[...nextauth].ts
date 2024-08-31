import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  pages: {
    signIn: "/",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        if (email !== "tanmoyb@gmail.com" || password !== "1234") {
          throw new Error("Invalid email or password");
        }
        return {
          email: "tanmoyb@gmail.com",
          id: 123,
          name: "Tanmoy Barash",
        };
      },
    }),
  ],
};

export default NextAuth(authOptions);
