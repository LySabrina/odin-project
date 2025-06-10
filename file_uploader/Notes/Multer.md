# Multer

PURPOSE: Parse & handle HTTP requests with multipart/form-data and provides interface for storing files on the server
Multer is a 3rd party package that helps process data that was sent from a form with the enc-type: multipart/data

Multer will add a file or files property to the request object.

File/Files property contains the files uploaded via the form.

## API References

**multer(opts:object | undefined)** - constructor for the multer

- opts is an optional object. If omitted, then the files will be stored in memory and never written to disk

Following properties of opts:

1. dest/storagee:string - where to store the files
2. fileFilter:function - fn to control which files are accepted
3. limits:number - limits of the uplaoded data
4. preservePath:boolean - keep the path of files instead of just the base name

- opts = an option object

Dst - use if you want to simply store a file in one directory (without any dynamic changes)
Storage - if you want to dynamically change how to store files (ex. user/user1/file.txt and user/user2/file.txt)

To use a storage, you must have a factory-function provided by multer that specifies where to store the files. 2 out of the box options are:

1. DiskStorage - store files on disk
2. MemoryStorage - store files on the RAM (temporary storage, will be gone on application rerun)

```js
const upload = multer({ dest: "uploads/" });
app.post(
  "/photos/upload",
  upload.array("photos", 12),
  function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  }
);
```

As shown, using upload functions are middleware. This middleware intercepts the HTTP request/responce cycle. This function adds the body and files properties to the request object.

```js
app.post("/profile", upload.single("avatar"), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
});
```

# Important Notes

multer can help parse multipart/form-data it can grab other input types besides file.

But if you layout in this way:

```js
<input type="file" name="file" id="file" multiple />
  <input type="text" value="<%=folder_name%>" name="folder_name" hidden />
  <label for="file">Upload your file:</label>
```

- It will not be able to process it

SO fix it in this order:

```js
<input type="text" value="<%=folder_name%>" name="folder_name" hidden />
  <input type="file" name="file" id="file" multiple />
  <label for="file">Upload your file:</label>
```

It may because multr will attempt to process in order so don't go mixing the types around

This code snippet uses upload.single() hence it will intercept the HTTP request/response cycle where it adds only file property to the request object.

Read this for later: https://www.reddit.com/r/javascript/comments/yr34u8/comment/ivrxxgt/?share_id=WGXyOMX-Fr9OuNrEhJ07l&utm_medium=android_app&utm_name=androidcss&utm_source=share&utm_term=1

  <!-- 
  Bug where the order: 
  <input type="file" name="file" id="file" multiple />
  <input type="text" value="<%=folder_name%>" name="folder_name" hidden />
  <label for="file">Upload your file:</label>

  Will not be able to process the input:text 
  so ordering of the input is important
  
  
  -->
  <!-- Hacky way of trying to add the folder to the request. I can't seem
    to figure out how to add the folder-name to the request object so we know wwhere to put the images 
  -->
