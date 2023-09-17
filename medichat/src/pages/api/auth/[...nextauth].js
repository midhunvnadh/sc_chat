import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import get_role from "@/functions/get_role";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CI,
      clientSecret: process.env.GOOGLE_CS,
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
      const email = session.user.email;
      const role = await get_role(email);
      session.user.role = role || null;
      // const institue_id = await get_role(token.userid);
      // if (!institue_id) {
      //   return null;
      // }
      // session.user.id = token.userid;
      // session.user.access_level = token.access_level;
      return session;
    },
  },
};

export default NextAuth(authOptions);
