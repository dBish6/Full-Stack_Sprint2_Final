/* server.js
   List of functions for running the node express HTTP sever on LocalHost
   with routes for the following URL destinations on the server and for running the home page routes. 

   http://localhost:${PORT}/search/

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

// const moment = require("moment");
router.use(express.static("public"));
// router.use(express.static("/search/mongo"));

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

// router.get("/mongo", function (req, res, next) {
//   res.setHeader("Last-Modified", new Date().toUTCString());
//   next();
// });

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
    // Autocomplete search or fuzzy search by the search index in the mongoDb movie collection on title.
    let auto = collection
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
    // res.setHeader("Last-Modified", new Date().toUTCString());
    // Render this route with m.search.ejs with the autocomplete.
    res.render("searchResults/m_search", { mSearch, title: "Mongo Search" });
    // Event emitter.
    myEmitter.emit(
      "log",
      `Searched: ${req.query.search}\tSTATUS: ${res.statusCode}`,
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
    let pSearch = await gresSearchData.titleSearch(req.query.search);
    // if (DEBUG) console.log(pSearch);
    // Render this route with p.search.ejs with the titleSearch function.
    res.render("searchResults/p_search", { pSearch, title: "Postgres Search" });
    // Event emitter.
    myEmitter.emit(
      "log",
      `Searched: ${req.query.search}\tSTATUS: ${res.statusCode}`,
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
      res.render("m_filmDetails", { mMovies, title: "Film Details" });
    }
  } catch (error) {
    console.error(error);
    // Send the 503 status code and render 503.ejs to the user.
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
      res.render("p_filmDetails", { pMovies, title: "Film Details" });
    }
  } catch (error) {
    console.error(error);
    // Send the 503 status code and render 503.ejs to the user.
    res.status(503).render("503");
  }
});

module.exports = router;
