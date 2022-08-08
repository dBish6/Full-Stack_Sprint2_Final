/* server.js
   List of functions for running the node express HTTP sever on LocalHost
   with routes for the following URL destinations on the server and for running the home page routes. 

   http://localhost:${PORT}/

   Author: David Bishop, Dominic Whelan, Chris Doucette and Blake Waddleton
   Creation Date: August 8, 2022
   Updates:
   Date, Author, Description
   Aug 8, 2022, Name, ...
   
*/

const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();

global.DEBUG = true;

const PORT = process.env.PORT || 4000;

// Setting the view engine to ejs.
app.set("view engine", "ejs");

// *Middleware*
// Event Emitters
app.use(morgan("dev"));
// So express can use your static files, which is my public folder; css, images, HTML, etc.
app.use(express.static("public"));
// So express can read the new perameters off the url and encoding them corrently; we can now use req.body.
app.use(express.urlencoded({ extended: true }));

// *Posgres Imports*
const pMovieData = require("./model/controllers/p.films.dal");
// <Require data.dal here>

// *Mongo Imports*
const mMovieData = require("./model/controllers/m.movies.dal");
const searchRouter = require("./routes/search");
const authRouter = require("./routes/auth");

// *Routers*
// Mongo Search Router
app.use("/search", searchRouter);
// Mongo Auth Router
app.use("/auth", authRouter);

app.listen(PORT, "localhost", () => {
  console.log(
    `Server is running on http://localhost:${PORT}; Ctrl-C to terminate...`
  );
  // Could create the database collection for whoever starts the server here; when the server starts up or we can have a command.
});

app.get("/", async (req, res) => {
  try {
    const mMovies = await mMovieData.displayAllMongoMovies();
    // if (DEBUG) console.log(mMovies);
    const pMovies = await pMovieData.displayAllPostgresFlims();
    if (DEBUG) console.log(pMovies);

    if (mMovies.length === 0) {
      // Send the 502 status code and render 502.ejs to the user.
      res.status(502).render("502");
    } else {
      // Render this route with home.ejs with the displayAllMongoMovies() and displayAllPostgresMovies().
      res.render("home", { mMovies, pMovies, title: "Home" });
    }
  } catch (error) {
    console.error(error);
    // Send the 503 status code and render 503.ejs to the user.
    res.status(503).render("503");
  }
});

// app.get("/mongo", async (req, res) => {
//   try {
//     const movies = await movieData;
//     if (DEBUG) console.log(movies);
//   } catch (error) {
//     console.error(error);
//   }
// });

// app.get("/postgres", async (req, res) => {
//   try {
//     const movies = await movieData;
//     if (DEBUG) console.log(movies);
//   } catch (error) {
//     console.error(error);
//   }
// });

// Renders the 404.ejs when there is no GET found; middleware.
app.use((req, res) => {
  res.status(404).render("404");
});
