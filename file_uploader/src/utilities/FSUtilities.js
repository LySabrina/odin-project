import * as fs from "node:fs/promises";
import { cwd } from "node:process";
import path from "node:path";
import { createReadStream } from "node:fs";
import { Buffer } from "node:buffer";
/**
 * @file FSUtilities file that contains functions related to CRUD for the file system 
 * 
 */


/**
 * @summary Creates a folder with inputted folder name
 * @description Performs existence checks before creation and ensure that it avoids
 * duplicate folder name
 *
 * @param {string} folder_name name of the new folder
 * @param {string} username username of user
 * @returns {boolean} determines whether folder creation was successful
 */
export async function createFolder(folder_name, username) {
  const directory = `${cwd()}/Data/${username}/${folder_name}`;
  try {
    await fs.access(directory);
    console.log("FILE EXIST ");
    return false;
  } catch (error) {
    console.log("File does not exist - creating...");
    await fs.mkdir(directory);
    console.log("Successfully created directory");
    return true;
  }
}

/**
 * @summary Check if the user has a folder associated with them. If not, create a folder for them 
 * @param username username of user
 */
export async function checkUserFolder(username) {
  const directory = `${cwd()}/Data/${username}/`;
  try {
    await fs.access(directory);
    return true;
  } catch (err) {
    try {
      await fs.mkdir(directory);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

/**
 * @summary Delete the folder with a folder name that is associated to the user along with its file contents inside  
 * @param {string} folder_name name of the folder
 * @param {string} username username of the user 
 */
export async function deleteFolder(folder_name, username) {
  const directory = `${cwd()}/Data/${username}/${folder_name}`;
  console.log("directory - ", directory);
  try {
    await fs.rm(directory, {
      recursive: true,
    });
    return true;
  } catch (err) {
    console.error(err);
    console.log("Can not delete not existence folder");
    return false;
  }
}

/**
 * @summary Renames the folder 
 * @param {string} folder_name name of the folder
 * @param {string} new_name new name of the folder
 * @param {string} username username of the user
 */
export async function renameFolder(folder_name, new_name, username) {
  const directory = `${cwd()}/Data/${username}/${folder_name}`;
  const newDirName = `${cwd()}/Data/${username}/${new_name}`;
  try {
    await fs.access(directory);
    await fs.rename(directory, newDirName);
    return true;
  } catch (err) {
    console.error(err);
    console.log("Failed to rename folder");
    return false;
  }
}

/**
 * @summary Reads the file from the file system and prepare to send to the client 
 * @description  Gets the file name associated with username under a certain folder_name
 * Provide the following infomration:
 * - File Size in Mbs
 * - File contents
 * @param {string} file_name name of the file 
 * @param {string} username name of the username associated with the file
 * @param {string} folder_name name of the folder where the file resides
 */
export async function getFile(file_name, username, folder_name) {
  const file = `${cwd()}/Data/${username}/${folder_name}/${file_name}`;
  const fileInfo = await fs.stat(file);
  const extension = path.extname(file); // later make sure to know how to encode the video
  const file_type = findFileType(extension);
  const sizeInMbs = fileInfo.size / 1e6;

  /**
   * Figure out the size of the file. Given size of the file use the FILE_LARGE_SIZE to see if its >=
   * If its a large file, send the data in chunks. Else send the raw binary data
   *
   */
  //send in chunks

  try {
    if (sizeInMbs >= process.env.FILE_LARGE_SIZE) {
      console.log("greater than the limit");
    } else {
      //earlier bug was having it read as a hex. This won't work for Base64
      const rawData = await fs.readFile(file);

      const buffer = Buffer.from(rawData);

      const base64 = buffer.toString("base64");

      // just read the whole damn file into memory. It aint big
      // const buf = [];
      // const readStream = createReadStream(file, { encoding: "hex" });
      // try {
      //   for await (const chunk of readStream) {
      //     buf.push(chunk);
      //   }
      // } catch (error) {
      //   console.error(error);
      // }
      // const buffer = Buffer.from(buf);

      console.log("file type - ", file_type);
      return {
        file_size: sizeInMbs,
        file_content: base64,
        file_type: file_type,
      };
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * @summary Given the extension string, return the mime-type
 * @param {string} extension - extension of the file 
 */
function findFileType(extension) {
  switch (extension) {
    case ".jpeg":
      return "image/jpeg";

    case ".jpg":
      return "image/jpeg";
    case ".png":
      return "image/png";

    case ".gif":
      return "image/gif";

    case ".mp4":
      return "video/mp4";

    case "./mov":
      return "video/mov";
  }
}

/**
 * @summary Deletes the file from its path  
 * @param {string} file_name the file to be deleted
 * @param {string} folder_name the folder that contains the file
 * @param {string} username the user that owns both the file and folder
 */
export async function deleteFile(file_name, folder_name, username) {
  try {
    const path = `${cwd()}/Data/${username}/${folder_name}/${file_name}`;
    console.log("PATH BEING DELETED:", path);
    await fs.unlink(path);
  } catch (error) {
    console.error(error);
  }
}
