import pool from "./pool.js";

export async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM Genre");
  return rows;
}

export async function checkIfGenreExist(genre) {
  const { rows } = await pool.query("select * from genre where name = ($1)", [
    genre,
  ]);
  console.log("rows", rows);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

export async function addNewGenre(genre) {
  console.log(genre);
  await pool.query("Insert into genre (name) values ($1)", [genre]);
}

/**
 * Performs a deletion of the genre and associated games that has this genre.
 * It will start a chain reaction of deletion from genre, game, game_genre, and game_dev
 * @param {string} genre - the genre that is to be deleted
 */
export async function deleteGenre(genre) {
  /**
   * When we delete a genre. We want to first delete its foreign-key tables (game_genre, game_dev)
   * After deleting the foreign-key table dependencies, we want to now delete the game itself and genre.
   *
   * Disregard above comments. I have added "ON DELETE CASCADE" this will help delete foreign-key rows so it
   * gets rid of child orphans.
   *
   * First I need to get the list of game ids associated with the genre. From there I can delete the games. Then the genre.
   * I must do it in this order or else, the game_genre table deletion cascade and I won't know which games to manually delete from
   * from the table
   */
  const { rows } = await pool.query(
    "Select game_id from game_genre where genre_name = $1",
    [genre]
  );
  console.log('game id associated with genres: ' , rows);
  const ids = rows.map((row) => row.game_id);

  await pool.query("Delete from game where id = ANY ($1)", [ids]);
  await pool.query("Delete from genre where name = $1", [genre]);
}
