import {betterAuth} from "better-auth"
import {prismaAdapter} from "better-auth/adapters/prisma" //👉 This helps auth talk to database using Prisma translator between auth and database”
import prisma from "./db.js";

export const auth = betterAuth({
   baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001", //Where my backend lives
   secret: process.env.BETTER_AUTH_SECRET || "your-secret-key", //used to keep sessions safe
   database:prismaAdapter(prisma, {
        provider: "postgresql", //Connect auth → database -Store users and sessions in database
    }),
    socialProviders:{
      github:{
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET //GitHub tells me: yes this user is real
      }
    }
});
