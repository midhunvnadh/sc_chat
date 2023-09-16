import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CI,
      clientSecret: process.env.GOOGLE_CS,
    }),
  ],
  secret: process.env.JWT_SECRET,
};

export default NextAuth(authOptions);
