import { body, oneOf } from "express-validator";
import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

export function validateLogin() {
  return [
    oneOf(
      [
        body("username").notEmpty().isLength({ min: 2 }),
        body("username").isEmail().normalizeEmail(),
      ],
      {
        message: "Invalid Username/Email",
      }
    ),
    body("password").notEmpty().withMessage("Wrong Password"),
  ];
}

export function validateSignup() {
  return [
    body("email")
      .isEmail()
      .normalizeEmail()
      .custom(async (email) => {
        const isEmail = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });

        if (isEmail) {
          throw new Error("Email is already in use");
        }
        return true;
      }),

    body("username")
      .isLength({ min: 2, max: 25 })
      .withMessage("Username between 2 and 25 characters")
      .custom(async (username) => {
        const isUsername = await prisma.user.findFirst({
          where: {
            username: username,
          },
        });

        if (isUsername) {
          throw new Error("Username is already in use");
        }
        return true;
      }),
    body("password")
      .isLength({ min: 8, max: 25 })
      .withMessage("Password must be at least length 8 to 25")
      .matches(/\d/)
      .withMessage("Must have a number in password"),

    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ];
}

export function validateFolderForm() {
  return [
    body("folder")
      .notEmpty()
      .withMessage("Must have a folder name")
      .custom(async (folder_name, { req }) => {
        const folder = await prisma.folder.findFirst({
          where: {
            folder_name: folder_name,
          },
        });

        if (folder) {
          throw new Error("Folder Name already exist");
        }
        return true;
      }),
  ];
}
