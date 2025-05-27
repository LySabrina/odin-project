import { Router } from "express";
import * as authController from "../controller/authController.js";
import {
  signUpValidation,
  loginValidation,
  memberValidation,
  adminValidation,
} from "../middleware/validation.js";
import passport from "passport";
const authRoutes = Router();

authRoutes.get("/sign-up", authController.getSignUp);
authRoutes.post("/sign-up", signUpValidation(), authController.postSignUp);

authRoutes.get("/login", authController.getLogin);
authRoutes.post(
  "/login",
  loginValidation(),
  authController.postLogin,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

authRoutes.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

authRoutes.get("/secret-member", authController.getMemberForm);
authRoutes.post(
  "/secret-member",
  memberValidation(),
  authController.postMemberForm
);

authRoutes.post("/admin-member", adminValidation(), authController.becomeAdmin);

export default authRoutes;
