import pool from "./pool.js";

export async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM Genre");
  return rows;
}

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

export async function deleteGenre(genre) {
  /**
   * Should we delete the games if they have the genre as well?
   * - yes, since we depend on it to find the games of that genre
   */
  const gamesWGenre = await getGamesBaseOnGenre([genre]);
  for (let i = 0; i < gamesWGenre.length; i++) {
    await deleteGameWithDevs(gamesWGenre[i].game_id);
  }
  await deleteGamesWithGenre(genre);

  // await pool.query("Delete from genre where name = $1", [genre]);
}

async function deleteGamesWithGenre(genre) {
  const { rows } = await pool.query(
    "Select game_id from game_genre where genre_name=$1",
    [genre]
  );

  await pool.query("delete from game_genre where genre_name = $1", [genre]);
  for (let i = 0; i < rows.length; i++) {
    await pool.query("Delete from game where id = $1", [rows[i].game_id]);
  }
}

async function deleteGameWithDevs(id) {
  await pool.query("Delete from game_developer where game_id = $1", [id]);
}
