import { PrismaClient } from "../../generated/prisma/client.js";
import * as FSUtilities from "../utilities/FSUtilities.js";
const prisma = new PrismaClient();
/**
 * On upload
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
      include: {
        folder: true,
      },
    });
    console.log(file, user);
    await FSUtilities.deleteFile(
      file.file_name,
      file.folder.folder_name,
      user.username
    );
    res.redirect(`/folder/${file.folder.folder_id}`);
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
}
