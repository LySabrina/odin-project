import { PrismaClient } from "../../generated/prisma/client.js";
import * as FSUtilities from "../utilities/FSUtilities.js";

/**
 * @file fileController used to handle all CRUD operations dealing with Files
 * @author lysabrina
 */

const prisma = new PrismaClient();
/**
 * @summary Handles POST creation of files
 * @description Utilizes multer which reads forms that have enctype = multipart. Multer will input a property called "file" onto the req. 
 * From this file property, I grab its information then use these information to create an entry into the File table 
 * Finally, the user will be redirected back to the folder directory they are in that the file lives under 
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export async function postCreateFile(req, res) {
  // Attempting to do req.body will not work as multer specifically targets mutlipart type forms so trying: req.body.folder_id will not work 
  const folder_id = req.folder_id;

  const { file_name, file_location } = req.file;

  try {
    await prisma.file.create({
      data: {
        file_name: file_name,
        file_upload_date: new Date(),
        file_location: file_location,
        folderId: parseInt(folder_id),
      },
    });

    res.redirect(`/folder/${folder_id}`);
  } catch (err) {
    console.error(err);
  }
}

/**
 * @summary Finds the file associated with the id and sends the file information.
 * @description Given a file_id, searches for that file in the database and on the file system
 *
 * File Information returned includes: file_name, file_location, file_upload_date, size of file, file contents
 * Finally renders the file.ejs page with the file information 
 * Example of endpoints: /folder/1, /folder/2
 *
 * @param {Express.Request} req http request
 * @param {Express.Response} res http response
 */
export async function getFile(req, res) {
  const { file_id } = req.params;
  const file_info = await prisma.file.findUnique({
    where: {
      file_id: parseInt(file_id),
    },
    include: {
      folder: true,
    },
  });

  const fileData = await FSUtilities.getFile(
    file_info.file_name,
    req.user.username,
    file_info.folder.folder_name
  );

  const file = { ...file_info, ...fileData };
  res.render("file", { file: file });
}

/**
 * @summary Deletes a file by id 
 * @description Given an id, delete it then on the file system, delete that file associated with the user 
 * @param {Express.Request} req HTTP Request
 * @param {Express.Response} res HTTP Response
 */
export async function deleteFile(req, res) {
  const { file_id } = req.params;
  const user = req.user;
  try {
    const file = await prisma.file.delete({
      where: {
        file_id: parseInt(file_id),
      },
    });
    const split = file.file_location.split("/");
    const folder_name = split[split.length - 1];
    console.log("FOLDER NAME: ", folder_name);
    await FSUtilities.deleteFile(file.file_name, folder_name, user.username);

    /**
     * BUG: when user deletes their file, the file AND THE FOLDER is deleted. Folder being deleted is not an intended bug. This happens because:
     * Since the original request had an action of "DELETE", when we redirect, it saves that action method and when we redirect,
     * It essentially calls: DELETE /folder/2 that is why the file and folder are deleted sequentially
     * Hence I must change the redirect to a 300. The question is why is POST-redirect does not activate post again?
     */
    res.redirect(303, `/folder/${file.folderId}`);
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
}
