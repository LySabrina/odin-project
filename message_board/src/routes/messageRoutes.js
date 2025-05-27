import { Router } from "express";
import * as messageController from "../controller/messageController.js";
import { messageFormValidation } from "../middleware/validation.js";
const messageRoutes = Router();

messageRoutes.get("/", messageController.getIndex);
messageRoutes.post(
  "/new-message",
  messageFormValidation(),
  messageController.postMessage
);

messageRoutes.delete("/delete/:id", messageController.deleteMessage);

export default messageRoutes;
