import pool from "../db/pool.js";
import * as queries from "../db/queries.js";
import { validationResult } from "express-validator";

export async function getAllMessages(req, res) {
  const messages = await queries.getAllMessages();
  res.render("index", { title: "Mini Messageboard", messages: messages });
}

export function getFormPage(req, res) {
  res.render("form", { title: "Form Page" });
}

export async function processFormPage(req, res) {
  const isValidReq = validationResult(req);
  if (!isValidReq.isEmpty()) {
    return res.status(400).render("form", { errors: isValidReq.array() });
  }

  const { message, username } = req.body;
  await queries.addNewMessage(username,message);
  res.redirect("/");
}
