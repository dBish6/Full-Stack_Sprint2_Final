/*
    m.auth.dal.js

    Routes for the Authenticate(Search for User), Sign Up (Create) and Delete User

    Author: Chris Doucette, David Bishop, Dominic Whelan & Blake Waddleton
    Creaton Date: Tuesday August 9, 2022
    Updates:
    Date, Author, Description
    Aug 9 2022, Chris Doucette. Added routes for the authenticate (Login / search for user) and Sign Up (Create) pages.
    Aug 10, 2022, Chris Doucette, Added route for Deletion of user.
    Aug 11, 2022, Dominic Whelan, Route additions and edits
*/

const { application } = require("express"); // Is this needed --Dominic
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
// const uuid = require('uuid');
const router = express.Router();

const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../model/controllers/m.auth.dal");

const { getUserByEmail } = require("../model/controllers/m.auth.dal");
// const { route } = require("./search");

router.use(express.static("public"));

// <Sign in Sign up routes go here>
// Sign In route
router.get("/login", checkNotAuthenticated, async (req, res) => {
  res.render("login", { title: "Login" });
});

// router.post("/authenticate", checkNotAuthenticated, async (req, res) => {
// try {
//   // if (DEBUG) console.log(req.body);

//   let userFound = await findUser(req.body.email, req.body.password);

//   if (userFound) {
//     // Code when User is Logged In
//     res.send("User logged In!!!!!");
//     res.end();
//   } else {
//     // Code when user is not found in Users collection
//     res.send("User NOT found, Please re-enter!");
//     res.end();
//   }
// } catch (error) {
//   console.error(error);
//   // Send the 503 status code and render 503.ejs to the user.
//   res.status(503).render("503");
//   res.end();
// }
// });

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

// Sign up Route
router.get("/register", checkNotAuthenticated, async (req, res) => {
  res.render("register", { title: "Sign Up" });
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };
    DEBUG && console.log(user);
    addUser(user);
    res.redirect("/login");
  } catch {
    console.error("User Register Failed");
    res.redirect("/register");
  }
});

// router.post("/signup", checkNotAuthenticated, async (req, res) => {
//   if (DEBUG) console.log(req.body);
//   try {
//     let userCreated = await createUser(
//       req.body.fullname,
//       req.body.email,
//       req.body.password
//     );

//     if (userCreated) {
//       // code for user created successfully
//       res.send("User was successfully created!!");
//       res.end();
//     } else {
//       // code for user not created
//       // will adjust to add message for error or if user already exists in Users collection
//       res.send("User NOT created!");
//       res.end();
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(503).render("503");
//     res.end();
//   }
// });

// Deletion of user routes
router.get("/delete", async (req, res) => {
  res.render("delete", { title: "Delete User" });
});

router.post("/delete", async (req, res) => {
  if (DEBUG) console.log(req.body);
  try {
    let userDeletion = await deleteUser(
      req.body.fullname,
      req.body.email,
      req.body.password
    );

    if (userDeletion) {
      // code for user successfully deleted
      res.send("User was successfully deleted!!");
      res.end();
    } else {
      // code for user not deleted
      // will adjust to add message for error or if user already exists in Users collection
      res.send("User NOT deleted!");
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.status(503).render("503");
    res.end();
  }
});

module.exports = router;
