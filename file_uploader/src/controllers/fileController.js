import { PrismaClient } from "../../generated/prisma/client.js";
import * as FSUtilities from "../utilities/FSUtilities.js";

/**
 * @file fileController used to handle all CRUD operations dealing with Files
 * @author lysabrina
 */

const prisma = new PrismaClient();
/**
 * @summary Handles POST creation of files
 * @description
 * @param {*} req
 * @param {*} res
 */
export async function postCreateFile(req, res) {
  // below will not print anything b/c form is multipart while the whole app uses urlencoded so only multer can prcoess multipart
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
 * Finds the file associated with the id and sends the file information.
 * File Information includes: file_name, file_location, file_upload_date, size of file, file contents
 *
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
 * Deletes a file
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
