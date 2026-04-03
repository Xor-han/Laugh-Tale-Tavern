import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "@/lib/db";

const isProduction = process.env.NODE_ENV === "production";
export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
      },
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
  advanced: {
    crossSubDomainCookies: {
      enabled: isProduction,
    },
    defaultCookieAttributes :{
      secure: isProduction,
      sameSite : isProduction ? "none" : "lax"
    }
  },
});
