import { validationResult } from "express-validator";
import * as authQueries from "../db/authQueries.js";
export async function getSignUp(req, res) {
  res.render("sign-up");
}

export async function postSignUp(req, res) {
  try {
    const isValid = validationResult(req);
    if (!isValid.isEmpty()) {
      console.log(isValid.array());
      res.status(400).render("sign-up", { errors: isValid.array() });
      return;
    }

    const { username, email, password } = req.body;
    console.log(`
      authController.postSignUp() - ${username} ${email} ${password}
    `);

    await authQueries.addNewUser(email, username, password);
    res.redirect("/");
  } catch (error) {
    console.log(`SERVER SIDE ERROR`, error);
    res.status(500).send("Internal Error. Contact the Devs");
  }
}

export async function getLogin(req, res) {
  res.render("login");
}

export async function postLogin(req, res, next) {
  try {
    const isValid = validationResult(req);
    if (!isValid.isEmpty()) {
      res.status(400).locals.errors = isValid.array();
      return await getLogin(req, res);
    }
    console.log("moving to passport authenticate");
    next();
  } catch (error) {
    console.log("SERVER SIDE ERROR", error);
    res.send("SERVER SIDE ERROR");
  }
}

export async function getMemberForm(req, res) {
  console.log("from getmemberform", req.user);
  res.render("secret-member", { user: req.user });
}

export async function postMemberForm(req, res) {
  const isValid = validationResult(req);

  if (!isValid.isEmpty()) {
    res.locals.errors = isValid.array();
    await getMemberForm(req, res);
    return;
  }

  const { user_id } = req.user;
  console.log("USR_ID", user_id);
  await authQueries.updateMember(user_id);
  res.redirect("/");
}

export async function becomeAdmin(req, res) {
  const isValid = validationResult(req);
  if (!isValid.isEmpty()) {
    res.locals.errors = isValid.array();
    await getMemberForm(req, res);
    return;
  }

  const { user_id } = req.user;

  await authQueries.updateToAdmin(user_id);
  res.redirect("/");
}
