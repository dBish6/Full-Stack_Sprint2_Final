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

const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
// const uuid = require('uuid');
const router = express.Router();

const {
  checkAuthenticated,
  checkNotAuthenticated,
  addUser,
  deleteUser,
} = require("../model/controllers/m.auth.dal");

router.use(express.static("public"));

// <Sign in Sign up routes go here>
// Sign In route
router.get("/login", checkNotAuthenticated, async (req, res) => {
  res.render("auth/login", { title: "Login" });
});

// Submits login information to be authenticated
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
  res.render("auth/register", { title: "Sign Up" });
});

// Submits user information to be added to the database
router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(req.body.password);
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };
    DEBUG && console.log("Registered User: " + user);
    addUser(user);
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.redirect("/auth/register");
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

// Route to User Account page
router.get("/profile", checkAuthenticated, async (req, res) => {
  res.render("auth/profile", { title: "My Profile" });
});

// Submits a request to delete user from
router.post("/profile", checkAuthenticated, async (req, res) => {
  console.log("Unsubscribing...");
  console.log("profile-POST" + user.email);
  try {
    await deleteUser(user.email);
    res.redirect("/auth/login");
    //   let userDeletion = await deleteUser(
    //     req.body.fullname,
    //     req.body.email,
    //     req.body.password
    //   );

    // if (userDeletion) {
    //   // code for user successfully deleted
    //   res.send("User was successfully deleted!!");
    //   req.logout(function (err) {
    //     if (err) {
    //       return next(err);
    //     }
    //     res.redirect("/login");
    //   });
    // } else {
    //   // code for user not deleted
    //   // will adjust to add message for error or if user already exists in Users collection
    //   res.send("User NOT deleted!");
    //   res.end();
    // }
  } catch (error) {
    console.error(error);
    // res.status(503).render("503");
    // res.end();
  }
});

router.delete("/logout", (req, res, next) => {
  DEBUG && console.log("logout initialized");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
});

module.exports = router;
