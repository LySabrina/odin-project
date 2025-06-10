# Passport.js NOTES

When login authentication fails, we want to display an error message.

Look at this particular code:

```js
passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureMessage: true,
});
```

On a success, the browser will call another HTTP request to go to "/". While on a failure,
it will go to "/login". Since redirect essentially creates another

When it hits eithr redirects, res.redirect() internally does the following:

1. Set the Status code to 302
2. Set the URL to the provided URL
3. Ends the original response by using internally res.end()

## Req and Res

Everytime we make a new HTTP request, Express will always make new req and res object. It will never save the old one.

That is why when we try to access res.locals upon a new HTTP request, the data is gone.

> How we stay logged in after logging in?

The reason why you are able to stay logged in is because app.get("/") checks if we have req.passport. It's there and has a user property. So when we redirect to another HTTP request which in this is the root.

It will run the app.get("/") and always put a user inside the locals.
