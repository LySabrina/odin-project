import { validationResult } from "express-validator";
import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcryptjs";
import { checkUserFolder } from "../utilities/FSUtilities.js";

/**
 * @file authController contains middleware functions to handle CRUD operations dealing with authentication
 * @author lysabrina
 */

const prisma = new PrismaClient(); // PrismaClient to use the generated Postgres tables

/**
 
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export async function getLogin(req, res) {
  const messages = req.session.messages || [];

  req.session.messages = []; //clear after reading

  res.render("login", { messages });
}

/**
 * @summary Handles the GET request to Sign Up Page
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export async function getSignUp(req, res) {
  res.render("signup");
}

export async function postLogin(req, res, next) {
  try {
    const isValid = validationResult(req);
    if (!isValid.isEmpty()) {
      res.locals.errors = isValid.array();

      return await getLogin(req, res);
    }

    console.log("Next to Passport Authenticate Middleware");

    next();
  } catch (error) {
    res.send("Server error", error);
    console.error(error);
  }
}

/**
 * @summary Handles the POST of Sign Up
 * @description Middleware checks if the inputs are valid and if they are not, re-render the Sign Up page and pass errors to tell the user.
 * If no errors, grabs the credentials (username, password, email) from the req.body then uses Prisma client to create a user.
 * Finally, use FSUtilities to create a folder with their username where their files are stored.
 * Then redirects them to the home page where they must login
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export async function postSignup(req, res) {
  try {
    const isValid = validationResult(req);
    if (!isValid.isEmpty()) {
      res.locals.errors = isValid.array();
      await getSignUp(req, res);
      return;
    }
    const { email, username, password } = req.body;
    await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: await bcrypt.hash(password, 10),
      },
    });

    await checkUserFolder(username);
    res.redirect("/");
  } catch (error) {
    res.send("Server error", error);
    console.error(error);
  }
}

/**
 * @summary Handles POST Log Out
 * @description Calls Passport.logout() in which it will remove req.user property and clear the login session.
 *
 *  Finally user is redirected back to the home page
 * @param {*} req
 * @param {*} res
 */
export async function postLogout(req, res) {
  req.logout((err) => {
    if (err) {
      console.log("authController - postLogout()");
      console.error(err);
      throw new Error(err);
    }

    res.redirect("/");
  });
}
