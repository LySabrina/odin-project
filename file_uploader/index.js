import express from "express";
import authRoutes from "./src/routes/authRoutes.js";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import process from "node:process";
import { Strategy as LocalStrategy } from "passport-local";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

import { PrismaClient } from "./generated/prisma/client.js";

import authenticate from "./src/middleware/authenticate.js";
import path from "node:path";
import fileRoutes from "./src/routes/fileRoutes.js";
import folderRoutes from "./src/routes/folderRoutes.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const prisma = new PrismaClient();
const __dirname = import.meta.dirname;
export const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 86400,
    },
    saveUninitialized: false,
    resave: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

passport.use(new LocalStrategy(authenticate)); //setting up how to authenitcate for Username/Password strategy
// passport.serializeUser(); //setting up how to serialize the user with passport property name inside the session data object
// passport.deserializeUser(); // setting how how to deserialize user - meaning how to get user data from just their id
// serialize a user so this will take just the user_id and place it into the session data
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

// gets the user_id from the session data and use that user_id to find the full user
passport.deserializeUser(async (user_id, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        user_id: user_id,
      },
    });

    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.get("/", (req, res) => {
  if (req.session.passport) {
    res.locals.user = req.user;
    // app.locals.user = req.user;
  }
  res.render("index");
});
app.use(express.urlencoded({ extended: true }));

app.use(fileRoutes);
app.use(authRoutes);
app.use(folderRoutes);
app.listen(8080);
