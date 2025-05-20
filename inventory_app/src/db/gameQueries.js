import pool from "./pool.js";

export async function getAllGames() {
  const { rows } = await pool.query("SELECT * FROM Game");
  return rows;
}

export async function getGamesBaseOnGenre(genres) {
  console.log("genres array: ", genres);
  let inQuery = "";
  for (let i = 0; i < genres.length; i++) {
    if (i === genres.length - 1) {
      inQuery += "'" + genres[i] + "'";
    } else {
      inQuery += "'" + genres[i] + "'" + ", ";
    }
  }
  console.log("in query , ", inQuery);
  const { rows } = await pool.query(
    "Select distinct game_id from game_genre where genre_name in (" +
      inQuery +
      ")"
  );

  console.log("rows", rows);
  // [{},{}]
  let gameInQuery = "";
  for (let i = 0; i < rows.length; i++) {
    if (i === rows.length - 1) {
      gameInQuery += rows[i].game_id;
    } else {
      gameInQuery += rows[i].game_id + ", ";
    }
  }
  console.log("gameInQuery + ", gameInQuery);
  const { rows: games } = await pool.query(
    "select * from game where id in (" + gameInQuery + ")"
  );

  return games;
}

export async function checkIfGameExist(name) {
  const { rows } = await pool.query("Select * from game where name = $1", [
    name,
  ]);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

/**
 * When adding a new game, we need to update the following tables:
 * Game
 * Game_Genre
 * Game_Dev
 * @param {string} name - name of the new game
 * @param {string[]} genres - genres associated with the new game
 * @param {string[]} devs - devs associated with working on the new game
 */
export async function addNewGame(name, date, genres, devs) {
  const { rows } = await pool.query(
    "Insert into Game (name,release_date) values ($1,$2) RETURNING ID",
    [name, date]
  );

  const game_id = rows[0].id;
  console.log("game_id", game_id);
  console.log("genre", genres);
  console.log("devs", devs);

  for (const genre of genres) {
    await pool.query(
      "Insert into Game_Genre(game_id, genre_name) values ($1,$2)",
      [game_id, genre]
    );
  }

  for (const dev_id of devs) {
    await pool.query(
      "Insert into game_developer(game_id, developer_id) values ($1,$2)",
      [game_id, dev_id]
    );
  }
}

export async function deleteGameById(id) {
  console.log("id", id) ;
  await pool.query("Delete from game where id = $1", [id]);
}
