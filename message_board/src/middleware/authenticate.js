import * as authQueries from "../db/authQueries.js";
import bcrypt from "bcryptjs";
/**
 * Middleware that checks for valid user.
 * This middleware will be used by Passport to authenticate
 */

async function authenticate(username, password, done) {
  try {
    const isEmailExist = await authQueries.checkIfEmailExist(username);
    const isUsernameExist = await authQueries.checkIfUsernameExist(username);
    if (!isEmailExist && !isUsernameExist) {
      return done(null, false, { message: "Username/email does not exist" });
    }
    const user = isEmailExist
      ? await authQueries.getUserFromCredentials(null, username)
      : await authQueries.getUserFromCredentials(username, null);

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: "Incorrect password" });
    }
    console.log("done!");
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}

export default authenticate;
