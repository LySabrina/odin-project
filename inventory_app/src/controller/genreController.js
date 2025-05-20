import * as genreQueries from "../db/genreQueries.js";
import * as indexController from "./controller.js";
import { validationResult } from "express-validator";

export async function getFormGenre(req, res) {
  const genres = await getGenres();

  res.render("genreForm", { genres: genres });
}

export async function getGenres() {
  const genres = await genreQueries.getAllGenres();
  return genres;
}

/**
 * Edit this
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function addNewGenre(req, res) {
  const isValid = validationResult(req);
  if (!isValid.isEmpty()) {
    res.locals.inputErrors = isValid.array();
    await getFormGenre(req, res);
    return;
  }
  const { genre } = req.body;
  const isGenreExist = await genreQueries.checkIfGenreExist(genre);

  if (isGenreExist) {
    res.status(400).locals.inputErrors = [{ msg: "Genre already exist. Try another" }];
    await getFormGenre(req, res);
    return;
  }

  await genreQueries.addNewGenre(genre);
  res.redirect("/");
}

export async function deleteGenre(req, res) {
  const genre = req.path.slice(1);
  await genreQueries.deleteGenre(genre);
  res.redirect("/");
}
