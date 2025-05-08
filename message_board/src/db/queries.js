import pool from "./pool.js";

export async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages ");
  console.log(rows);
  return rows;
}

export async function addNewMessage(username, message) {
  const date = new Date();
  const today = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`;

  await pool.query(
    "INSERT INTO messages (username, message, added) values($1, $2, $3)",
    [username, message, today]
  );
}

