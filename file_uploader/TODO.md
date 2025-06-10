DO DOCUMENTATION AND WORKFLOW NOTES

- Draw step by step of the authentication process
- Finish CRUD for folders

  ~~- Fix create folder where when we create a folder, use Node.js to create an actual folder inside the /Data/username/<FOLDER_NAME>~~

  ~~- Read folders list~~
  ~~- Delete folder~~

- fix where a user that does not has permission to access or delete a folder an error page message
  --> Create a specific error page for them (ex. Error 400 - You do not have access to this resource)
- create a form to rename folder

- Finish CRUD for files
  ~~- Create file with a folder (for now, create a file under a folder)~~
  ~~- Display image file~~

  - Display video file
  - Read files (if there's no files associated with user, tell them that they have no files)
    - when reading files, we should have a folder that opens and shows the files underneath it
  - Update file (they can only change the folder parent)
  - Delete files

  Nice to have features:

  - Folder within a folder!!
