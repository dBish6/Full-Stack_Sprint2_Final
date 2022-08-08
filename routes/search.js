const express = require("express");
const router = express.Router();

const {} = require("../model/controllers/m.search.dal");

router.post("/search/postgres", async (req, res) => {
  try {
    // He actually used toArray() here for ejs, but we could still probably use json.
    res.status(200).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
});

router.post("/search/mongo", async (req, res) => {
  try {
    res.status(200).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
});

module.exports = router;
