import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
console.log(process.env.DB_NAME);
const SQL = `
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR(255),
        message VARCHAR(255),
        added DATE
    );

    INSERT INTO messages (username, message, added) VALUES 
    ('James', 'Happy New Year!', '2025-01-01'),
    ('Tom', 'In this economy?', '2025-01-02'),
    ('Jane', 'Hello, world!', '2025-02-22');
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
