import express from "express";
import router from "./src/routes/routes.js";
import path from "node:path";
const __dirname = import.meta.dirname;
const app = express();

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(8080);
