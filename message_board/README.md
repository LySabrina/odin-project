# Notes

import "dotenv/config"; // side effect import, automatically runs the code inside this file, no need to

Use the above import where you are connecting to your database. Not in the index.js

# Passport - Install Packages

Necessary packages to install:

1. Passport
2. Passport Strategies (it does not come with Passport, you must manually install it) (ex. passport-local, passport-discord, passport-facebook)

- Why does it not come with Passport? To avoid unneceessary packages / strategies we will not use and reduce the application size

3. Express

4. express-session = middleware to create a session

- we will not be manually using it, passport will do that work for us

## Eexpress-Session: Sessions To Know

Since passport uses express-session behind the scenes. Lets know what sessions are.

**Sessions** - persist data across requests from same client. It lets server retain information about the client as they navigate across the web application.

> What are some data sesssions can store?

- user authentication
- user specific data (ex. preferences of theme color)
- shopping cart info (for when they log back in )

When a user signs in, we want to assign a specific session-id to them so our server can distinguish from different clients.

> What does a session look like?

Data format like JSON that is stored on the backend server (MemoryStore - only meant for development). In most cases, its best to save the session data in reliable storage mechanism (ex.Redis)

Session Data format stored on the backend or other storage may look different based on projects.

Example Storage Data JSON format:

```json
{
  "user": {
    "username": "john.doe",
    "email": "john.doe@example.com",
    "userId": 12345
  },
  "shoppingCart": {
    "item1": { "quantity": 2, "price": 10 },
    "item2": { "quantity": 1, "price": 25 }
  },
  "isAuthenticated": true
}
```

Hence, assume our session_id = abc123 will be a key that maps to the session data value.

> How to set session data?

Inside req.session is data of the session. To add items, just do:
req.session.<KEY_PROPERTY> = YOUR_VALUE

> How do we assign a session-id to a client?

Provide a secret value that is used by express-session to create a hash value.

> Why do we need to hash the value for a session-id?

So that no other person can steal that hash value. If another user steals that hash value, they essentially hijack their session and can perform malicious intent.

> What do we do with the session-id?

Send it over to the user in the form of a cookie.
It will be in a key called: **connect.sid** with the session id value

> How do we send over a cookie?

It will be in the form of a HTTP Header which is: Set-Cookie header

This Set-Cookie Header has the following value:
key=value

```
Set-Cookie: yummy_cookie=chocolate
```

**Session Hijacking**

The client may send this cookie for new requests so the server identifies who they are.

Some cases, we have session-hijacking:

- Where a hacker steals a user's session id. Then they use that session-id to pretend they are that real user.

How does session-hijacking occur?

- If there is not a secure HTTPS connection so that means the package are in plain-text so we need to encrypt
- hacker randomly generates a hash values to brute-force
  --> especially this cause is important reasons why we need a strong secret value so to make it harder to brute force

  ## Express-Session: session()

  session(options) - creates a session middleware with options.

  options: {
  secret [REQUIRED]: string|array - secret used to sign session_id cookies.

  }

# Passport - Setup

1. Set up our express-session so passport can use it.
   We first install Passport. Then we need to figure out what authentication strategy we are using (ex.username/password, Google Sign In, Facebook Sign IN)

authenticate(strategy:string, redirects:Object);

2. Set up authenticate() middleware method that passport will use to check if the user has the correct credentials.

This specific authentication middleware method should be used by the appropriate strategy.

When our user is logged in, we want to make sure they are logged in and avoid making them log back in everytime they visit a new page.

We can do this by creating a cookie. This cookie keeps track of who they are for our server

So how do we create this cookie? passport.serializeUser() will create a cookie for our user and give it to them to store.

Then we call passport.deserializeUser() to check who they are based on the cookie.


## passport.serializeUser() & passport.deserializeUser()
These two functions are for serializing and deserializing users to and from the current session object.

We do not store the entier user object in the session. We only store the user_id inside the session data. 

**passport.serializeUser()** - determines which data of the user object should be stored in the session. Whatever data we serialized will be stored in the session data. Internally, it will do something like:
req.session.passport.user = {} 

**passport.deserializeUser()** - used to retrieve user data from session & perform some condition-based operations

Everytime endpoint is hit, the backend runs deserialization() 


# Resources
https://blog.bitsrc.io/authentication-work-flow-using-express-session-and-passportjs-4291231285a5 

https://stackoverflow.com/questions/29066348/passportjs-serializeuser-and-deserializeuser-execution-flow

https://www.fullstackfoundations.com/blog/passport-jwt#the-reality-of-this-situation