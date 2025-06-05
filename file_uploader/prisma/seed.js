import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: "username@example.com" },
    update: {},
    create: {
      email: "username@example.com",
      username: "username",
      password: await bcrypt.hash("password1", 10),
      folders: {
        create: {
          folder_name: "myFolder",
          files: {
            create: {
              file_name: "example.txt",
              file_upload_date: new Date("2025/05/30"),
              file_location: "../Files/myFolder/",
            },
          },
        },
      },
    },
  });
  console.log(user1);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
