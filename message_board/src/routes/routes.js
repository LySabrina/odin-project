import { Router } from "express";
import * as controller from "../controller/controller.js";
import { body, validationResult } from "express-validator";

const router = Router();

router.get("/", controller.getAllMessages);
router.get("/form", controller.getFormPage);
router.post(
  "/new",
  body("message").notEmpty(),
  body("username").notEmpty(),
  controller.processFormPage
);

export default router;
