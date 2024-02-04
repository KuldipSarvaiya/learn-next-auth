import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        // only to assing role to user
        // get user email and check for role in db and send role with it and also send other db info
        console.log("Profile Google: ", profile);

        let userRole = "Google User";
        return {
          ...profile,
          id: profile.sub,
          role: userRole,
          image: profile.picture,
        };
      },
      // authorization: {
      //   params: {
      //     prompt: "consent",
      //     access_type: "offline",
      //     response_type: "code",
      //   },
      // },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email:",
          type: "email",
          required: true,
          placeholder: "Enter Email",
        },
        password: {
          label: "Password:",
          type: "password",
          required: true,
          placeholder: "Enter Password",
        },
      },
      authorize(credentials) {
        try {
          let role =
            credentials.email === "my.admin.email@gmail.com"
              ? "admin"
              : "user";
          console.log("Good Pass : ", credentials);
          return { ...credentials, role };
        } catch (error) {
          console.log(error);
        }
        return false;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      return session;
    },
  },
};
