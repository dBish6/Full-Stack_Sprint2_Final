/* server.js
   List of functions for running the node express HTTP sever on LocalHost
   with routes for the following URL destinations on the server and for running the home page routes. 

   http://localhost:${PORT}/

   Author: 
   Creation Date: July 13, 2022
   Updates:
   Date, Author, Description
   Aug 8, 2022, Name, ...
   
*/

const express = require("express");
const app = express();
// const cors = require("cors");
// const morgan = require("morgan");
require("dotenv").config();
// console.log(process.env);

// const pool = require("./data/db.config");

global.DEBUG = true;

const PORT = process.env.PORT || 4000;

app.listen(PORT, "localhost", () => {
  console.log(
    `Server is running on http://localhost:${PORT}; Ctrl-C to terminate...`
  );
  // Could create the database collection for whoever starts the server here; when the server starts up or we can have a command.
});

// *Middleware*
// Event Emitters
// app.use(morgan("dev"));
app.use(express.static("public"));
// When getting data from the client; to get json data from req.body.
app.use(express.json());
// Probably going to need to use this at some point.
// app.use(express.urlencoded({ extended: true }));

// *Posgres Imports*
// <Require data.dal here>
// *Mongo Imports*
const searchRouter = require("./routes/search");
const authRouter = require("./routes/auth");

// *Routers*
// Mongo Search Router
app.use("/api/search", searchRouter);
// Mongo Auth Router
app.use("/api/auth", authRouter);

// <Home routes go here>
