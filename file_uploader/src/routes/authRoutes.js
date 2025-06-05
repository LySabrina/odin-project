import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { validateLogin, validateSignup } from "../middleware/validate.js";
import passport from "passport";

const authRoutes = Router();

authRoutes.get("/login", authController.getLogin);
authRoutes.get("/signup", authController.getSignUp);
authRoutes.post("/signup", validateSignup(), authController.postSignuo);

authRoutes.post(
  "/login",
  validateLogin(),
  authController.postLogin,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

authRoutes.post("/logout", authController.postLogout);

export default authRoutes;
