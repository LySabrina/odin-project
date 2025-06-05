import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const DB_HOST = process.env.HOST;
const DB_USER = process.env.USER;
const DB_PASSWORD = process.env.PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;

const pool = new Pool({
  host: DB_HOST,
  user: DB_HOST,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
});
