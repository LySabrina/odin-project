import * as messageQueries from "../db/messageQueries.js";
import { validationResult } from "express-validator";

export async function getIndex(req, res) {
  const messages = await messageQueries.getAllMessages();
  if (req.session) {
    console.log("from messageController", req.user);
  }
  res.render("index", { messages: messages, user: req.user });
}

export async function postMessage(req, res) {
  const isValid = validationResult(req);

  if (!isValid.isEmpty()) {
    res.locals.errors = isValid.array();

    await getIndex(req, res);
    // do not do res.redirect("/") that makes a whole new request
    return;
  }
  const { message } = req.body;
  console.log("adding...");
  await messageQueries.addMessage(req.user.user_id, message);
  res.redirect("/");
}

export async function deleteMessage(req, res) {
  const { id } = req.params;
  await messageQueries.deleteMessage(id);
  await getIndex(req, res);
}
