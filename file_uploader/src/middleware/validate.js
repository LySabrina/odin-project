import { body, oneOf } from "express-validator";
import { PrismaClient } from "../../generated/prisma/client.js";

/**
 * @file Validation middleware for authentication
 */

const prisma = new PrismaClient();

/**
 * @summary Validates the username and password of the login page
 * @description Validates the login by checking if the input with name = username is either email or username. If it's a username, ensure it has a min length of 2 and if email, ensures it's a valid email and normalize email 
 *
 * Also checks if the password is not emtpy 
 */
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

/**
 * @summary Valideates the email, username, password, confirmPassword of the sign up page
 * @description  Validates the sign up by checking if the email is valid, normalized and uses a custom validation that checks if the email is not in use.
 * Checks if the username is at least length 2 to 25 and checks if the username is not in use.
 * Checks if the password is at least length 8 to 25 and has at least one number 
 * Checks if the confirmPassword matches the password 
 */
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

/**
 * @summary Validates the Folder Form 
 * @description Ensures that the name of the folder is not empty and the folder does not exist with the associated user 
 */
export function validateFolderForm() {
  return [
    body("folder")
      .notEmpty()
      .withMessage("Must have a folder name")
      .custom(async (folder_name, { req }) => {
        const folder = await prisma.folder.findFirst({
          where: {
            folder_name: folder_name,
            userId: req.user.user_id,
          },
        });

        if (folder) {
          throw new Error("Folder Name already exist");
        }
        return true;
      }),
  ];
}
