import pool from "./pool.js";

export async function getAllDevs() {
  const { rows: devs } = await pool.query("select * from developer");
  return devs;
}