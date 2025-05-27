import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import bcrypt from "bcryptjs";

const sample_password = await bcrypt.hash("example1", 10);

const SQL = `
DROP TABLE IF EXISTS Messages;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Roles;

CREATE TABLE IF NOT EXISTS Roles (
    role_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    role_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    role_id INTEGER,
    email VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    isMember BOOLEAN,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

CREATE TABLE IF NOT EXISTS Messages (
    message_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER, 
    points INTEGER, 
    message VARCHAR(255),
    added DATE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Insert roles correctly
INSERT INTO Roles (role_name) VALUES
    ('User'),
    ('Member'),
    ('Admin');


  INSERT INTO USERS (role_id, email, username,password,isMember) values 
  (1,'example@email.com', 'example', '${sample_password}',false), 
  (2, 'example@gmail.com', 'anotherExample', '${sample_password}', true);
  
  INSERT INTO Messages(user_id, points, message,added) values (1, 0, 'Test message', '2025/05/27'), (2,0,'Another test message', '2025/05/27');
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
