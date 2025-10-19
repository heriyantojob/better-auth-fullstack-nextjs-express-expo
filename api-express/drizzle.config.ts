import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  // driver: "d1-http",
  dbCredentials: {
    url: process.env.DB_URL!,
   
  },
  dialect: "mysql",
  verbose: true,
  strict: true,
});


