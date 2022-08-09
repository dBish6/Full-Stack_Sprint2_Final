const express = require("express");
const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    res.render("login");
  })
  .put(async (req, res) => {});

router.get("/auth", (req, res) => {
  DEBUG && console.log("GET /auth");
  const username = req.query.username;
  const password = req.query.password;
  res.render("loggedIn", { username, password });
});

module.exports = router;
