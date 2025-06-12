# File Uploader

## About Project & Completion Progress

User can upload files.

Users are able to upload files into folders.
Basic CRUD operations on these folders and files are needed.

Folders:

- Add new folders
- Update folders with files inside
- Delete Folders and all the files inside said folder
- Read folders
- Change folder name

Files:

- Add new files
- Delete Files
- Read file data
- Download file
- Change file name

Completion Thus Far:

- Set up Postgres with Passport for authentication using username + password combo
- Set up the following CRUD for folders:

  - CREATE
  - READ
  - DELETE

- Set up the following CRUD for files:
  - CREATE
  - READ
  - DELETE

Tasks To DO:

- Visit TODO.md

## Project Folder Structure Explaination

/ - project root
--> /Data - folder where we store the images, might need to move to Supabase for image storing
--> /prisma - prisma folder with generation file and prisma client to interact with postgres
--> /src - folder for src
--> /index.js --> entry point
