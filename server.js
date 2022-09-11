/* server.js
   List of functions for running the node express HTTP sever on LocalHost
   with routes for the following URL destinations on the server and for running the home page routes. 

   http://localhost:${PORT}/

   Author: David Bishop, Dominic Whelan, Chris Doucette and Blake Waddleton
   Creation Date: August 8, 2022
   Updates:
   Date, Author, Description
   August 8, 2022, David; set up databases configs and everything, implemented modules for server, imports and necessary middleware,
   set up the views and made the home routes for searching.
   August 9, 2022, David; implemented a mongoDb connection in app.listen.
   August 10, 2022, David; implemented working details views and routes when in home page.
   August 11, 2022, Dominic; Authentication middleware added
   August 11, 2022, David; Styled home page and partials.
   August 12, 2022, David; We all fixed bugs when Dominic added authentication into the main project.
   August 13, 2022, David; Styling.
   August 13, 2022, Dominic; Comments added, cleanup
   August 13, 2022, David; Stylied mongo details page and search results.
   August 15, 2022, David; expaned button was implemented.
   August 17, 2022, David; added the /id/post-review POST route and success route.
   August 18, 2022, David; made clientScripts file in public instead of using the script tag in the home.ejs and fetched the data instead with a filter, and stylied.
   August 19, 2022, David; Media queries, bug fixes.
   
 */

// Module Imports
const express = require("express");
const app = express();

const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const morgan = require("morgan");
const moment = require("moment");
const { ObjectId } = require("mongodb");
require("dotenv").config();

// Declare function to initialize Passport
const initializePassport = require("./model/passport");
initializePassport(passport);

// Middleware Function that verifies user authentication
const { checkAuthenticated } = require("./model/controllers/m.auth.dal");

global.DEBUG = false;

const PORT = process.env.PORT || 4000;

// Setting the view engine to ejs.
app.set("view engine", "ejs");

// *Middleware*
// Event Emitters
if (DEBUG) app.use(morgan("dev"));
// So express can use your static files, which is my public folder; css, images, HTML, etc.
app.use(express.static("public"));
// So express can read the new perameters off the url and encoding them corrently.
app.use(express.urlencoded({ extended: true }));
// For fetching data.
app.use(express.json());
// For error messaging.
app.use(flash());

// Define parameters of the session.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

DEBUG &&
  app.use((req, res, next) => {
    console.log(req.session);
    next();
  });

// *Posgres Imports*
const pMovieData = require("./model/controllers/p.films.dal");

// *Mongo Imports*
const mMovieData = require("./model/controllers/m.movies.dal");
const { addReview } = require("./model/controllers/m.auth.dal");
const searchRouter = require("./routes/search");
const authRouter = require("./routes/auth");

// *Routers*
// Mongo/postgres Search Router
app.use("/search", searchRouter);
// Mongo Auth Router
app.use("/auth", authRouter);

app.listen(PORT, "localhost", async () => {
  // I made it so it connects to the mongoDb collection whenever you start up the server, instead of connecting it everytime we run a dal function.
  const dal = require("./model/mongo.db.config");
  try {
    await dal.connect();
    // You actually don't need global here, it works somehow without it, but it makes sense having it there.
    global.movieCollection = dal.db("sample_mflix").collection("movies");
    global.userCollection = dal.db("sample_mflix").collection("users");
    global.commentCollection = dal.db("sample_mflix").collection("comments");
    global.profileIcon = null;

    console.log(
      `Server is running on http://localhost:${PORT}; Ctrl-C to terminate...`
    );
  } catch (error) {
    console.error(error);
  }
});

// Display both movies from both databases.
app.get("/", checkAuthenticated, async (req, res) => {
  try {
    const mMovies = await mMovieData.displayAllMongoMovies();
    // if (DEBUG) console.log(mMovies);
    const pMovies = await pMovieData.displayAllPostgresFilms();
    if (DEBUG) console.log(pMovies);

    if (mMovies.length === 0 || pMovies.length === 0) {
      // Send the 502 status code and render 502.ejs to the user.
      res.status(502).render("502");
    } else {
      // Render this route with home.ejs with the displayAllMongoMovies() and displayAllPostgresMovies().
      res.render("home", {
        mMovies,
        pMovies,
        title: "Home",
      });
    }
  } catch (error) {
    console.error(error);
    // Send the 503 status code and render 503.ejs to the user.
    res.status(503).render("503");
  }
});

// Displays success page.
app.get("/success", checkAuthenticated, async (req, res) => {
  try {
    // Render this route with success.ejs with just the title for the title in head tag.
    res.render("success", { title: "Review Submitted" });
  } catch (error) {
    console.error(error);
    res.status(503).render("503");
  }
});

// Both of these routes are for fetching the movies for the expand button.
app.get("/allMongoMovies", async (req, res) => {
  const movie_data = await mMovieData.displayAllMongoMovies();
  res.json(movie_data);
});

app.get("/allPostgresMovies", async (req, res) => {
  const movie_data = await pMovieData.displayAllPostgresFilms();
  res.json(movie_data);
});

// Display movies details for both databases.
app.get("/:id", checkAuthenticated, async (req, res) => {
  try {
    if (DEBUG) console.log(req.params);

    // If the url is a mongo _id because they always have a "a" in them, display mongo details.
    if (req.url.includes("a")) {
      const mMovies = await mMovieData.getMongoMovieDetails(req.params.id);
      if (DEBUG) console.log(mMovies);

      if (mMovies.length === 0) {
        res.status(502).render("502");
      } else {
        // Render this route with m_filmDetails.ejs with the getMongoFilmDetails function.
        res.render("m_filmDetails", { mMovies, title: "Home" });
      }
      // Else just display postgres details to the user because the id includes all numbers.
    } else {
      const pMovies = await pMovieData.getPostgresFilmDetails(req.params.id);
      if (DEBUG) console.log(pMovies);

      if (pMovies.length === 0) {
        res.status(502).render("502");
      } else {
        // Render this route with p_filmDetails.ejs with the getPostgresFilmDetails function.
        res.render("p_filmDetails", { pMovies, title: "Home" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(503).render("503");
  }
});

// Posts the review to the database.
app.post("/:id/post-review", checkAuthenticated, async (req, res) => {
  try {
    if (DEBUG) console.log(req.params);
    if (DEBUG) console.log(req.body);

    // user is from global varible in m.auth.dal.js.
    // Stucture of the document in comments collection, but stuctured by object for sending.
    if (req.url.includes("a")) {
      const userReview = {
        name: user.name,
        email: user.email,
        movie_id: ObjectId(req.params.id),
        text: req.body.paragraph_text,
        date: moment().format(),
      };
      if (DEBUG) console.log(userReview);
      await addReview(userReview);
    } else {
      // For Postgres
      await pMovieData.addPostgresFilmReview(
        user.name,
        user.email,
        req.params.id,
        req.body.paragraph_text
      );
    }
    req.flash("success", "Your review was successfully created");

    // Redirect back to the same page when successful.
    res.redirect(`/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(503).render("503");
  }
});

// Renders the 404.ejs when there is no GET found; middleware.
app.use((req, res) => {
  res.status(404).render("404");
});
