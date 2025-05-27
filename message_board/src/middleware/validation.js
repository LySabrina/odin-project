import * as authQueries from "../db/authQueries.js";
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

/**
 * Middleware that validates the sign up form and login form
 */
import { body, oneOf } from "express-validator";

export function signUpValidation() {
  return [
    body("email")
      .isEmail()
      .normalizeEmail()
      .custom(async (email) => {
        if (await authQueries.checkIfEmailExist(email)) {
          throw new Error("Email already in use");
        }
      }),

    body("username")
      .isLength({ min: 2, max: 15 })
      .withMessage("Username must be at least length 2 and at max 15")
      .custom(async (username) => {
        if (await authQueries.checkIfUsernameExist(username)) {
          throw new Error("Username is already in use");
        }
      }),

    body("password")
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be at least 8 characters long and at max 20")
      .matches(/\d/)
      .withMessage("Password must have at least a number"),

    body("confirmPasword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ];
}

export function loginValidation() {
  return [
    oneOf(
      [
        body("username").isEmail().normalizeEmail(),
        body("username").isLength({ min: 2 }),
      ],
      { message: "Invalid Username/Email" }
    ),
    body("password").notEmpty().withMessage("Wrong password"),
  ];
}

export function messageFormValidation() {
  return [
    body("message").notEmpty().withMessage("Empty Message Body not allowed"),
  ];
}

export function memberValidation() {
  return body("member")
    .notEmpty()
    .withMessage("Member can not be empty!")
    .custom((value) => value === process.env.MEMBER_SECRET)
    .withMessage("Incorrect Member Secret!");
}

export function adminValidation() {
  return body("admin")
    .notEmpty()
    .withMessage("Admin can not be empty")
    .custom((value) => value === process.env.ADMIN_SECRET)
    .withMessage("Incorrect Admin Secret!");
}
