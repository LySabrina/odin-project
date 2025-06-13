# API Basics
Instead of creating an app that hosts both the DB and view templates - developers separate them into separate projects.

Host the backend and DB on a server (ex. On Heroku or Digital Ocean).
Host the frontend on another (ex. Github Pages, Netlify) 

This separation is called Jamstack.

Benefits of this web development architecture pattern:
- project becomes more modular (instea dof combining business logic with view logic) 
- can use a single backend source for multiple frontend applications

In this web-dev architecure, instead of having backend send to the client a HTML resource,
it will instead send a JSON resource.

> Frontend + Backend applications talk to each other using JSON 

# REST
API can take different forms for routes.
Instead, we should follow REST convention.

In this convention, we refer directly to the resource.

Examples: 

/posts - to get all posts 
/posts/:postId - get a single post 
/posts/:postId/comments - get all comments of a single post
/posts/:postId/comments/:commentId - get a specific comment from a specific post 

# CORS

## ORIGIN
**Origin** - protocol + hostname + port 

2 Devices have the same origin only when the scheme, hostname, and port all match 

**Same Origin**
- http://example.com/app1/index.html
- http://example.com/app2/index.html

Notice how they have the same scheme (http) and hostname (example.com). 
- The different file path does not match 

**Same Origin**
- http://example.com:80
- http://example.com

These are the same origin b/c server delivers HTTP content through port 80 by default 

**DIFFERENT ORIGIN - DIFFERENT SCHEME**
- http://example.com/app1 
- https://example.com/app1 

**DIFFERENT ORIGIN - DIFFERENT HOSTNAME**
- http://example.com
- http://www.example.com
- http://myapp.example.com 

**DIFFERENT ORIGIN - DIFFERENT PORTS**
- http://example.com
- http://example.com:8080

## Same-Origin Policy 
Security mechanism that restricts how a document or script loaded by one origin can interact with a resource from another origin


Purpose: Prevent malicious scripts running 
Ex) Prevents malicious website from running JS in a browser to read data from a 3rd party web-mail service (which user is logged into) 

**How can this be a problem with the backend and frontend separation?**
- Since we will be running the backend and frontend on different computers.Then the host will surely be different. 

So how can we fix this? Enable Cross-Origin Resource Sharing (CORS)

When setting up CORS, make your server only accept origin from your frontend server. Block other origins. 

## CORS

