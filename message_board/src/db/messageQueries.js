import pool from "./pool.js";

export async function getAllMessages() {
  /**
   * Join sql which gets the all the messages and the username associated with the message
   * Join Users and Messages
   *
   */
  const { rows: messages } = await pool.query(
    "Select message_id, messages.user_id, points, message, added, username from Messages inner join Users on messages.user_id = users.user_id"
  );
  return messages;
}

export async function addMessage(user_id, message) {
  const date = new Date().toLocaleDateString("en-ZA");

  await pool.query(
    "Insert into messages(user_id, points, message, added) values($1,$2,$3,$4)",
    [user_id, 0, message, date]
  );
}

export async function findMessage(message_id) {
  const { rows: message } = await pool.query(
    "Select * from messages where message_id = $1",
    [message_id]
  );
  if (rows.length == 0) {
    return null;
  } else {
    return message;
  }
}

export async function deleteMessage(message_id) {
  await pool.query("Delete from messages where message_id =$1", [message_id]);
}
