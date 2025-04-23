import { authConfig } from "./auth.config";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "./models/authSchema";

// authenticate users when signing in
export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (!credentials) return null;
                const email = credentials.email as string;
                const password = credentials.password as string;

                try {
                    const user = await User.findOne({ email }).lean();

                    if (user) {
                        const isMatch = await bcrypt.compare(password, user.password);
                        if (isMatch) {
                            return {
                                id: user._id.toString(),
                                email: user.email,
                                username: user.username,
                            };
                        } else {
                            console.log("Email or Password is not correct");
                            return null;
                        }
                    } else {
                        console.log("User not found");
                        return null;
                    }
                } catch (error: any) {
                    console.log("An error occurred:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {

        async jwt({ token, user }) {
            if (user) {
              token.username = (user as any).username;
            }
            return token;
          },

        async session({ session, token }) {
          if (session.user) {
            session.user.id = token.sub as string;
            session.user.username = (token as any).username;
          }
          return session;
        },
      },
});
