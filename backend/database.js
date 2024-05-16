import dotenv from "dotenv";
import pg from "pg";
const { Pool } = pg;

dotenv.config();

export const pool = new Pool({
  user: "postgres",
  password: "root123",
  host: "localhost",
  port: 5432,
  database: "bugtracker",
});
