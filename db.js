import 'dotenv/config';
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing. Please create a .env file in the project folder.");
}

export const sql = neon(connectionString);