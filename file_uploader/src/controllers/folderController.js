import { validationResult } from "express-validator";
import * as FSUtilities from "../utilities/FSUtilities.js";
import { PrismaClient } from "../../generated/prisma/client.js";
const prisma = new PrismaClient();

export async function postCreateFolder(req, res, next) {
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
  console.log(folder_name);
  console.log(req.user);

  //creates an entry in the database
  const folder = await prisma.folder.create({
    data: {
      folder_name: folder_name,
      userId: parseInt(req.user.user_id),
    },
  });

  //creates an actual folder in the file systme

  if (folder) {
    const folderCreated = await FSUtilities.createFolder(
      folder_name,
      req.user.username
    );
    if (!folderCreated) {
      next(new Error("Failed to create folder"));
    }
  }

  res.redirect("/");
  // EDIT HERE TO REDIRECT
}

export async function getFolders(req, res, next) {
  if (req.user) {
    const userId = req.user.user_id;
    console.log(req.user);
    if (userId) {
      const folders = await prisma.folder.findMany({
        where: {
          userId: userId,
        },
      });
      console.log("HEEE");
      console.log(folders);
      res.locals.folders = folders;
    }
  }
  next();
}

/**
 * Edit here
 * @param {*} req
 * @param {*} res
 */
export async function getFolder(req, res) {
  if (!req.user) {
    //edit here to give a warning they need to login
    return res.redirect("/login");
  }
  const { folder_id } = req.params;
  console.log("my usser", req.user);

  const folder = await prisma.folder.findUniqueOrThrow({
    select: {
      folder_name: true,
      folder_id: true,
      files: {
        select: {
          file_id: true,
          file_name: true,
          file_upload_date: true,
        },
      },
    },
    where: {
      folder_id: parseInt(folder_id),
    },
  });
  console.log("folder", folder);

  res.render("folder", { folder: folder });
}

/**
 * Delete a folder with the folder id and the user_id
 * User_id is needed because a different user may create a HTTP request
 * to delete a folder they may not have permission to delete
 */
export async function deleteFolder(req, res) {
  try {
    //early error was that i forgot to convert string into int
    // additionally, i did not wrap around a try-catch which left error unhandleed (error was PrismaClientValidationErrro)
    const folder_id = parseInt(req.params.folder_id);

    const user = req.user;
    console.log("user fro mdelete ", user);
    const deletedFolder = await prisma.folder.delete({
      where: {
        folder_id: folder_id,
        userId: user.user_id,
      },
    });

    console.log("deleted folder - ", deletedFolder);
    console.log(folder_id);
    await FSUtilities.deleteFolder(deletedFolder.folder_name, user.username);

    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
}
