import { Router } from "express";
import * as gameController from "../controller/gameController.js";
import { body } from "express-validator";
const gameRouter = Router();

/**
 *  Edit this body to fix
 */

gameRouter.get("/", gameController.getGameForm);
gameRouter.post(
  "/",
  body("name").notEmpty().withMessage("Name can not be empty"),
  body("date").notEmpty().withMessage("Set a release date"),
  body("genre").notEmpty().withMessage("Select at least 1 genre"),
  body("dev").notEmpty().withMessage("Select at least 1 dev"),
  gameController.addNewGame
);
gameRouter.delete("/:id", gameController.deleteGameById);

export default gameRouter;
