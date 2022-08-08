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
const router = express.Router();

const monSearchData = require("../model/controllers/m.search.dal");
const gresSearchData = require("../model/controllers/p.search.dal");

router.post("/mongo", async (req, res) => {
  try {
    if (DEBUG) console.log(req.body);
    let mSearch = await monSearchData.fullSearch(req.body.search);
    // Render this route with m.search.ejs with the fullSearch function.
    res.render("searchResults/m_search", { mSearch, title: "Mongo Search" });
    // res.redirect("/search/mongo1", { mSearch });
  } catch (error) {
    console.error(error);
    // Send the 503 status code and render 503.ejs to the user.
    res.status(503).render("503");
  }
});

router.post("/postgres", async (req, res) => {
  try {
    let pSearch = await gresSearchData.titleSearch(req.body.search);
    // Render this route with m.search.ejs with the fullSearch function.
    res.render("searchResults/p_search", { pSearch, title: "Postgres Search" });
  } catch (error) {
    console.error(error);
    res.status(503).render("503");
  }
});

// router.get("/mongo1", async (req, res) => {
//   try {
//     // Render this route with m.search.ejs with the fullSearch function.
//     res.render("searchResults/m_search", { mSearch, title: "Mongo Search" });
//   } catch (error) {
//     console.error(error);
//     // Send the 503 status code and render 503.ejs to the user.
//     res.status(503).render("503");
//   }
// });

// router
//   .post("/mongo", async (req, res) => {
//     try {
//       if (DEBUG) console.log(req.body);
//       let mSearch = await searchData.fullSearch(req.body.search);
//       // Render this route with m.search.ejs with the fullSearch function.
//       // router.get("/mongo"),
//       //   async (req, res) => {
//       //     res.render("searchResults/m_search", {
//       //       mSearch,
//       //       title: "Mongo Search",
//       //     });
//       //     // res.redirect("/search/mongo1", { mSearch });
//       //   };
//     } catch (error) {
//       console.error(error);
//       // Send the 503 status code and render 503.ejs to the user.
//       res.status(503).render("503");
//     }
//   })
//   .get((req, res) => {
//     res.render("searchResults/m_search", { mSearch, title: "Mongo Search" });
//     // res.redirect("/search/mongo1", { mSearch });
//   });

module.exports = router;
