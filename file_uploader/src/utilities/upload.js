import multer from "multer";
import { cwd } from "node:process";

/**
 * @file Configure multer and return instance of it 
 * Configuring multer to use the file system to store files and only accept certain files
 */

/**
 * By default, multer.diskStorage pases a req and file
 * Some reason, the body is empty
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { folder_name, folder_id } = req.body;

    const user = req.user;

    req.file = {
      file_name: file.originalname,
      file_location: `${cwd()}/Data/${user.username}/${folder_name}`,
    };
    req.folder_id = folder_id;
    console.log("is file,", file);
    console.log(`/Data/${user.username}`);
    cb(null, `${cwd()}/Data/${user.username}/${folder_name}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const file_type = file.mimetype;
    if (
      file_type === "image/jpeg" ||
      file_type === "image/png" ||
      file_type === "image/gif" ||
      file_type === "video/mp4" ||
      file_type === "video/mov"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid valid type"), false);
    }
  },
});

export default upload;
