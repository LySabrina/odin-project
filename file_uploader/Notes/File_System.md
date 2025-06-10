# Node FS

TO use the Node File System:

```
import * as fs from "node:fs/promise"

```

FS = File System
File System is used for:

- reading files
- writing files
- managing folders

FS provides both asynchronous and synchronous methods

Async Method: Non-blocking & for production app to maintain responsiveness

Sync Method: Blocking and better suited for scripts or initialization tasks where performance is less critical

# Process

Proccess is an object that provides information about the current Node.js process.

```
import process from "node:process"
```

# Reading Files

There are several ways to read files.

1. fs.readFile(path:string)

- Reads the contents of the files into memory before returning the data
- Since it reads the contents into memory, this may serve as an issue if the user uploaded a huge file size

2. fs.createReadStream(path:string)

- Reads the file in chunks rather than attempt to fill in the whole available memory space

### Terminology

Root Project = directory where your entry point / starting point of your main application lives + where Node.js will execute your code

There are 2 types of files we concern ourselves with:

1. Text File - computer file that contains lines of binary code. But that binary code is translated into readable characters to us.

Example your text file will have the following: "i love you"
Which you see when you open the text file, but internally ,it looks like this:

```
01101001 00100000 01101100 01101111 01110110 01100101 00100000 01111001 01101111 01110101
```

2. Binary File -files stored as hexadecimals
   Hex format of "hello"

```
68 65 6C 6C 6F
```

This is then read by the computer as ones and zeros which is converted to its real binary data:

```
01101000 01100101 01101100 01101100 01101111
```

All computer store information in the form of bits (0s and 1s) using binary code. It does not matter if its a text file or binary file (ex. jpegs, png etc.). To the computer, it will always be 0s and 1s.

When you open a binary file in a text-editor (or in terminal or any stdout), they are interpreted as a bunch of gibberish.
This is because the text editor was not made to read binary encoded data. Only text like 0s and 1s.

Binary Files are stored as hexadecimal (16-based) so trying to use a text-editor designed to read in binary (8-based) makes it hard which leads to gibberish in the file.

Although, you can force the text-editor to read it by only using hexadecimal it can translate. For example, we can use 0x30 and 0x31 which are 0 and 1 respectively.

```
text editor:
10101010
01010101
10101010
01010101

Stored data (ASCII values for '1', '0' and 'new line'):
0x31 0x30 0x31 0x30 0x31 0x30 0x31 0x30 0x0D 0x30 0x31 0x30 0x31 0x30 0x31 0x30 0x31 0x0D 0x31 0x30 0x31 0x30 0x31 0x30 0x31 0x30 0x0D  0x30 0x31 0x30 0x31 0x30 0x31 0x30 0x31

```

# Sending Images over to a Client

There are multiple ways to send over a file to a client:

1. Binary (raw) - may be not the best solution if the image file size is large
2. Base64 (not recommended) - base64 actually makes the size of sending larger (mostly used for embedded in html)
3. Streaming - send chunks to the user (good for large files and videos)

**Note**

- The data is stored as 8 bits. The reason its called hexadecimal is because there are 16 unique characters to represent (0-9 and A-F)
- Large files size are considered: megabytes and upwards
