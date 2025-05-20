import * as gameQueries from "../db/gameQueries.js";
import * as genreQueries from "../db/genreQueries.js";

/**
 * Handles index path
 * @param {*} req
 * @param {*} res
 * @returns
 */
export async function getIndex(req, res) {
  let selectedGenres = req.query["genre[]"];
  console.log("selectedgenres", selectedGenres);
  if (typeof selectedGenres === "string") {
    selectedGenres = [selectedGenres];
  }
  const genres = await genreQueries.getAllGenres();

  res.locals.genres = genres;

  if (selectedGenres === undefined) {
    const games = await gameQueries.getAllGames();

    return res.render("index", {
      games: games,
    });
  }

  const games = await gameQueries.getGamesBaseOnGenre(selectedGenres);

  res.render("index", { games: games });
}
