import { validationResult } from "express-validator";
import { PrismaClient } from "../../generated/prisma/client.js";
const prisma = new PrismaClient();

export async function postCreateFolder(req, res) {
  const isValid = validationResult(req);
  if (!isValid.isEmpty()) {
    res.locals.folderErrors = isValid.array();
    console.log(res.locals.folderErrors);
    if (req.session.passport) {
      res.locals.user = req.user;
    }
    return res.render("index");
  }
  const { folder: folder_name } = req.body;

  console.log(req.user);

  await prisma.folder.create({
    data: {
      folder_name: folder_name,
      userId: req.user.user_id,
    },
  });

  res.redirect("/");
  // EDIT HERE TO REDIRECT
}
