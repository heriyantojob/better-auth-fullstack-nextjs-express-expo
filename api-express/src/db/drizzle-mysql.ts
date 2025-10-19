import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import * as schema from './schema';
// Load environment variables from .env file
dotenv.config();

// Ensure the DB_URL environment variable is set
if (!process.env.DB_URL) {
  throw new Error("Missing DB_URL environment variable");
}

// Create a MySQL connection pool using the connection string
const poolConnection = mysql.createPool(process.env.DB_URL);

// Initialize Drizzle ORM with the connection pool
export const db = drizzle(poolConnection,{ schema,mode:"default" });

