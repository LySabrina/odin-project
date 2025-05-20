import { Pool } from "pg";
import * as credentials from "./credentials.js";

export default new Pool({
  host: credentials.DB_HOST,
  database: credentials.DB_NAME,
  user: credentials.DB_USER,
  password: credentials.DB_PASSWORD,
  port: credentials.DB_PORT,
});
