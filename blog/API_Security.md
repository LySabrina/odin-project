# API SECURITY
Using Passport.js + Username/Password authentication strategy works but it can be complicated if we separate our backend and frontend into separate process.

Before we had the frontend + backend combined where our server serves HTML pages to the users when they request a resource.

To secure our API when we have a separate backend and frontend is to use tokens. 

IDEA:
- Users logs in
- Secure token is created
- For future requests, the token is passed in the header of our request object 


