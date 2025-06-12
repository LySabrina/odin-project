import { validationResult } from "express-validator";
import * as FSUtilities from "../utilities/FSUtilities.js";
import { PrismaClient } from "../../generated/prisma/client.js";

/**
 * @file folderController used to handle CRUD operations dealing with folders
 * @author lysabrina
 */
const prisma = new PrismaClient();


/**
 * @summary Handles POST to create a new folder 
 * @param {Express.Request} req  
 * @param {Express.Response} res 
 *
 *
 */
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

/*
 * @summary Gets folders associated with a user 
 * @param {Express.Request} req 
 * @param {Express.Request} res
 * @param {Express.NextFunction} next middleware 
 */
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
      console.log(folders);
      res.locals.folders = folders;
    }
  }
  next();
}

/**
 * @summary Gets a single folder that belongs to the user 
 * @description Gets a folder that is associated with a user. If the user is not logged in, warn the user and redirect them to the login page 
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export async function getFolder(req, res) {
  if (!req.user) {
    //edit here to give a warning they need to login
    return res.redirect("/login");
  }
  const { folder_id } = req.params;

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

  res.render("folder", { folder: folder });
}

/**
 * @summary Deletes a folder by id that belongs to a user 
 * @decription Deletes a folder that uses the file id and the user id. Next, it calls the FSUtilities.deleteFolder() to delete on
 * the file system. Finally, it redirects the user back to the home page. 
 * User_id is needed because a different user may create a HTTP request
 * to delete a folder they may not have permission to delete
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export async function deleteFolder(req, res) {
  try {
    //early error was that i forgot to convert string into int
    // additionally, i did not wrap around a try-catch which left error unhandleed (error was PrismaClientValidationErrro)
    const folder_id = parseInt(req.params.folder_id);

    const user = req.user;
    const deletedFolder = await prisma.folder.delete({
      where: {
        folder_id: folder_id,
        userId: user.user_id,
      },
    });

    await FSUtilities.deleteFolder(deletedFolder.folder_name, user.username);

    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
}
