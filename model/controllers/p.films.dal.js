/* p.films.dal.js
   Anything to do with the films in the DVD rentals database.
   displayAllPostgresFilms() - gets all the films only with their id, title & year in the database from the film_list view.
   getFilmDetails() - gets the details of the films in the database by the film_list view; description, rating, etc.

   Author: David Bishop
   Creation Date: July 13, 2022
   Updates:
   Date, Author, Description
   August 8, 2022, David; implemented displayAllPostgresFilms() and getPostgresFilmDetails().
   August 18, 2022, David; imlemented addPostgresFilmReview function.

*/

const dal = require("../postgres.db.config");

const displayAllPostgresFilms = async () => {
  let response;
  try {
    response = await dal.query(
      "SELECT fid, title, release_year FROM film_list ORDER BY random() LIMIT 50;"
    );
    return response.rows;
  } catch (error) {
    console.error(error);
  }
};

// Gets the film details by whatever id passed in as a parameter.
const getPostgresFilmDetails = async (id) => {
  let response;
  try {
    response = await dal.query("SELECT * FROM film_list WHERE fid = $1;", [id]);
    return response.rows;
  } catch (error) {
    console.error(error);
  }
};

const addPostgresFilmReview = async (fname, email, film_id, review) => {
  let response;
  try {
    const sql =
      "INSERT INTO review( full_name, email, film_id, review_text) \
    VALUES($1, $2, $3, $4)";
    response = await dal.query(sql, [fname, email, film_id, review]);
    return response.rows;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  displayAllPostgresFilms,
  getPostgresFilmDetails,
  addPostgresFilmReview,
};
