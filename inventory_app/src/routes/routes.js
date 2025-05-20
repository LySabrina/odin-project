import { Router } from "express";
import * as controller from "../controller/controller.js";
import { body } from "express-validator";

const routes = Router();

routes.get("/", controller.getIndex);
// routes.get("/form-genre", controller.getFormGenre);
// routes.post("/form-genre", body("genre").notEmpty(), controller.addNewGenre);
// routes.delete("/form-genre/:genre", controller.deleteGenre);

export default routes;
