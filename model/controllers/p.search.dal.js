/* p.search.dal.js
   Dal functions that has to do with searching by Postgres.
   titleSearch() - Searches by the givin text passed in from the search bar giving results that is LIKE the text passed in based on title.

   Author: David Bishop
   Creation Date: July 13, 2022
   Updates:
   Date, Author, Description
   August 8, 2022, David; implemented titleSearch().

*/

const dal = require("../postgres.db.config");

const titleSearch = async (title) => {
  let response;
  try {
    // ILIKE is simliar to LIKE but ILIKE makes it not case sensitive; better for searching.
    response = await dal.query(
      `SELECT * FROM film_list WHERE title ILIKE $1 LIMIT 35;`,
      [`%${title}%`]
    );
    return response.rows;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { titleSearch };
