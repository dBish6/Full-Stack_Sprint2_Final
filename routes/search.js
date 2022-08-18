/* server.js
   List of route functions for anything that has to do searching and detail page for when on search page.

   http://localhost:${PORT}/search

   Author: David Bishop, Dominic Whelan, Chris Doucette and Blake Waddleton
   Creation Date: August 8, 2022
   Updates:
   Date, Author, Description
   August 8, 2022, David; implemented POST routes, /mongo & /postgres, for the form action on searching using req.body and added views.
   August 9, 2022, David; changed the two POST routes to GET and used req.query, makes more sense that way.
   August 9, 2022, David; made a autocomple search for /mongo; was alot of playing around.
   August 10, 2022, David; made working details routes when searched.
   
*/

const express = require("express");
const router = express.Router();

router.use(express.static("public"));

// Search event logging.
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const logEvent = require("../event_emitters/logEvents");

myEmitter.addListener("log", (msg, level, logName) =>
  logEvent(msg, level, logName)
);

// *Postgres Imports*
const gresSearchData = require("../model/controllers/p.search.dal");
const pMovieData = require("../model/controllers/p.films.dal");

// *Mongo Imports*
// const monSearchData = require("../model/controllers/m.search.dal");
const mMovieData = require("../model/controllers/m.movies.dal");

// *Old Search*
// router.get("/mongo", async (req, res) => {
//   try {
//     if (DEBUG) console.log(req.query);
//     let mSearch = await monSearchData.fullSearch(req.query.search);
//     // Render this route with m.search.ejs with the fullSearch function.
//     res.render("searchResults/m_search", { mSearch, title: "Mongo Search" });
//   } catch (error) {
//     console.error(error);
//     // Send the 503 status code and render 503.ejs to the user.
//     res.status(503).render("503");
//   }
// });

// Mongo search route.
router.get("/mongo", async (req, res) => {
  try {
    if (DEBUG) console.log(req.query);
    // Redirects the user if there is no input.
    if (!req.query.search) {
      res.redirect("/");
    }
    // Autocomplete search or fuzzy search by the search index in the mongoDb movie collection on title.
    let auto = movieCollection
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: `${req.query.search}`,
              path: "title",
              fuzzy: {
                maxEdits: 2,
              },
            },
          },
        },
      ])
      .limit(30);
    const mSearch = await auto.toArray();
    // if (DEBUG) console.log(mSearch);
    // Render this route with m.search.ejs with the autocomplete.
    res.render("searchResults/m_search", { mSearch, title: "Mongo Search" });
    // Event emitter when user searches.

    myEmitter.emit(
      "log",
      `UserID: ${user._id}\tSearched: ${req.query.search}\tSTATUS: ${res.statusCode}`,
      "INFO",
      "searchLog.log"
    );
  } catch (error) {
    console.error(error);
    // Send the 503 status code and render 503.ejs to the user.
    res.status(503).render("503");
  }
});

// Postgres search route.
router.get("/postgres", async (req, res) => {
  try {
    if (DEBUG) console.log(req.query);
    if (!req.query.search) {
      res.redirect("/");
    }
    let pSearch = await gresSearchData.titleSearch(req.query.search);
    // if (DEBUG) console.log(pSearch);
    // Render this route with p.search.ejs with the titleSearch function.
    res.render("searchResults/p_search", { pSearch, title: "Postgres Search" });
    // Event emitter when user searches.
    myEmitter.emit(
      "log",
      `UserID: ${user._id}\tSearched: ${req.query.search}\tSTATUS: ${res.statusCode}`,
      "INFO",
      "searchLog.log"
    );
  } catch (error) {
    console.error(error);
    res.status(503).render("503");
  }
});

// Details route when searched with mongo.
router.get("/mongo/:_id", async (req, res) => {
  try {
    if (DEBUG) console.log(req.params);
    const mMovies = await mMovieData.getMongoMovieDetails(req.params._id);
    if (DEBUG) console.log(mMovies);

    if (mMovies.length === 0) {
      res.status(502).render("502");
    } else {
      // Render this route with m_filmDetails.ejs with the getMongoMovieDetails function.
      res.render("m_filmDetails", { mMovies, title: "Film Details" });
    }
  } catch (error) {
    console.error(error);
    res.status(503).render("503");
  }
});

// Details route when searched with postgres.
router.get("/postgres/:id", async (req, res) => {
  try {
    if (DEBUG) console.log(req.params);
    const pMovies = await pMovieData.getPostgresFilmDetails(req.params.id);
    if (DEBUG) console.log(pMovies);

    if (pMovies.length === 0) {
      res.status(502).render("502");
    } else {
      // Render this route with p_filmDetails.ejs with the getPostgresFilmDetails function.
      res.render("p_filmDetails", { pMovies, title: "Film Details" });
    }
  } catch (error) {
    console.error(error);
    res.status(503).render("503");
  }
});

module.exports = router;
