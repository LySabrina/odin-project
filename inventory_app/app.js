import express from "express";
import routes from "./src/routes/routes.js";
import path from "node:path";
import gameRouter from "./src/routes/gameRouter.js";
import genreRouter from "./src/routes/genreRouter.js";
const app = express();
const __dirname = import.meta.dirname;

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/form-game", gameRouter);
app.use("/form-genre", genreRouter);
app.use("/", routes);
app.listen(8080);
