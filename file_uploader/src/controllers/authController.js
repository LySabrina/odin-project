import { validationResult } from "express-validator";
import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export async function getLogin(req, res) {
  const messages = req.session.messages || [];

  req.session.messages = []; //clear after reading

  res.render("login", { messages });
}
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

export async function postSignuo(req, res) {
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

    res.redirect("/");
  } catch (error) {
    res.send("Server error", error);
    console.error(error);
  }
}

/**
 * Internally calls Passport logout() function
 * Passport logout() function will remove the req.user property and clear the login session
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
