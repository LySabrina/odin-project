/**
 * Authenticate Middleware
 * Checks whether the username, password are correct
 *
 */

import bcrypt from "bcryptjs";

import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

/**
 * Authenticate users from username (or email) and password. Checks if either the username or email is valid. Then compares the password with one another.
 * @param {string} username provided username or email format
 * @param {string} password provided password that is not yet hashed
 * @param {Function} done next middleware function
 * @returns Promise determines whether credentails are correct
 */
async function authenticate(username, password, done) {
  try {
    const isEmailExist = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    const isUsernameExist = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    const user = isEmailExist ? isEmailExist : isUsernameExist;
    if (!user) {
      return done(null, false, { message: "Incorrect Credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return done(null, false, { message: "Incorrect credentials" });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}

export default authenticate;
