const express = require("express");
// const bcrypt = require('bcrypt');
// const uuid = require('uuid');
const router = express.Router();

const {} = require("../model/controllers/m.auth.dal");

router.use(express.static("public"));

// <Sign in Sign up routes go here>

// One route will be getting (still a post) a user from the database when they login; /.

// then posting new users to the database; /new

module.exports = router;
