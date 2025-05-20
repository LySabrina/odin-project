import * as gameQueries from "../db/gameQueries.js";
import * as genreQueries from "../db/genreQueries.js";
import * as devQueries from "../db/devQueries.js";

import { validationResult } from "express-validator";

// export async function getGames() {
//   const games = await gameQueries.getAllGames();
//   return games;
// }

export async function getGameForm(req, res) {
  const games = await gameQueries.getAllGames();
  const genres = await genreQueries.getAllGenres();
  const devs = await devQueries.getAllDevs();

  res.render("gameForm", { games: games, genres: genres, devs: devs });
}

/**
 * When adding a new game, the user must have:
 * Name - not empty
 * Genre selected - at least one
 * Dev selected - at least one
 * @param {*} req
 * @param {*} res
 */
export async function addNewGame(req, res) {
  const validRequest = validationResult(req);

  if (!validRequest.isEmpty()) {
    res.status(400).locals.inputErrors = validRequest.array();
    await getGameForm(req, res);
    return;
  }
  // name will be a string, date is a string, genre is an array of strings, dev is an array of string
  const { name, date, genre, dev } = req.body;

  const isGameExist = await gameQueries.checkIfGameExist(name);
  if (isGameExist) {
    res.status(400).locals.inputErrors = [{ msg: "Game already exist" }];
    await getGameForm(req, res);
    return;
  }

  await gameQueries.addNewGame(
    name,
    date,
    typeof genre === "string" ? [genre] : genre,
    typeof dev === "string" ? [dev] : dev
  );
  res.redirect("/");
}

export async function deleteGameById(req, res) {
  const isValid = validationResult(req);
  if (!isValid.isEmpty()) {
    res.status(400).locals.inputErrors = [{ msg: "Invalid game id" }];
    return await getGameForm(req, res);
  }

  const { id } = req.params;

  await gameQueries.deleteGameById(id);
  res.redirect("/");
}
