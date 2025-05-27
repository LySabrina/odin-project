import express from "express";
import router from "./src/routes/routes.js";
import path from "node:path";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import authenticate from "./src/middleware/authenticate.js";
import bcrypt from "bcryptjs";
import pool from "./src/db/pool.js";
import authRoutes from "./src/routes/authRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const __dirname = import.meta.dirname;
const SECRET = process.env.SECRET;

const app = express();
app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 360000 },
  })
);
app.use(passport.session());

passport.use(new LocalStrategy(authenticate));

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (user_id, done) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", messageRoutes);
app.use("/", authRoutes);
app.use("/", router);

app.listen(8080);
