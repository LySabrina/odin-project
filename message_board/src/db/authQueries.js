import bcrypt from "bcryptjs";

import pool from "./pool.js";

/**
 * Check if correct order when inserting
 * @param {*} email
 * @param {*} username
 * @param {*} password
 */
export async function addNewUser(email, username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "Insert into users(role_id, email, username, password, isMember) values ($1,$2, $3, $4, $5)",
    [1, email, username, hashedPassword, false]
  );
}

export async function getUserFromCredentials(username, email) {
  if (username) {
    const { rows: user } = await pool.query(
      "Select * from users where username = $1",
      [username]
    );

    return user[0];
  } else {
    const { rows: user } = await pool.query(
      "Select * from users where email = $1",
      email
    );

    return user[0];
  }
}

export async function checkIfUsernameExist(username) {
  const { rows: isExists } = await pool.query(
    "select exists (select 1 from users where username = $1)",
    [username]
  );
  console.log(isExists);
  return isExists[0].exists;
}

export async function checkIfEmailExist(email) {
  const { rows: isExists } = await pool.query(
    "select exists (select 1 from users where email = $1)",
    [email]
  );

  return isExists[0].exists;
}

export async function updateMember(user_id) {
  await pool.query(
    "UPDATE users set isMember=true, role_id=2 where user_id = $1",
    [user_id]
  );
}

export async function updateToAdmin(user_id) {
  console.log("here - ", user_id);
  await pool.query(
    "UPDATE users set role_id=3, isMember=true where user_id=$1",
    [user_id]
  );
}
