/*  auth.js
    Routes for the Authenticate(Search for User), Sign Up (Create) and Delete User

    Author: Chris Doucette, David Bishop, Dominic Whelan & Blake Waddleton
    Creaton Date: Tuesday August 9, 2022
    Updates:
    Date, Author, Description
    Aug 9 2022, Chris Doucette. Added routes for the authenticate (Login / search for user) and Sign Up (Create) pages.
    Aug 10, 2022, Chris Doucette, Added route for Deletion of user.
    Aug 11, 2022, Dominic Whelan, Route additions and edits
    Aug 12, 2022, Dominic Whelan, deleteUser route edits
    Aug 13, 2022, Dominic Whelan, comments, logging added, cleanup
    Aug 17, 2022, Dominic Whelan, register error handling, flash messaging
    Aug 18, 2022, Dominic Whelan, code cleanup, comments

*/

const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const router = express.Router();

const {
  checkAuthenticated,
  checkNotAuthenticated,
  getUserByEmail,
  addUser,
  addProfileImage,
  addPhone,
  addGenre,
  deleteUser,
  getMongoReviews,
  getPostgresReviews,
} = require("../model/controllers/m.auth.dal");

router.use(express.static("public"));

// Sign In route
router.get("/login", checkNotAuthenticated, async (req, res) => {
  res.render("auth/login", { title: "Login" });
});

// Submits login information to be authenticated
router.post(
  "/login",
  checkNotAuthenticated,
  // calls function from passport.js
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
    // encrypt password before storing in database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // object created to insert into database
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: null,
      favorite_genre: null,
      image: null,
    };

    // if statements to handle optional input fields
    if (req.body.phone) {
      user.phone = req.body.phone;
    }

    if (req.body.favorite_genre) {
      user.favorite_genre = req.body.favorite_genre;
    }

    if (req.body.image) {
      user.image = req.body.image;
    }
    // Check to see if user already exists
    const userCheck = await getUserByEmail(user.email);
    if (userCheck != null) {
      console.log("User already exists");
      req.flash("error", "User with this email already exists");
      res.redirect("/auth/register");
    } else {
      DEBUG && console.log("Registering User: " + user.name);
      addUser(user);
      DEBUG && console.log("Registered User: " + user.name);
      req.flash("success", "User succesfully created");
      res.redirect("/auth/login");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Oops, Something went wrong");
    res.redirect("/auth/register");
  }
});

// Route to User Account page
router.get("/profile", checkAuthenticated, async (req, res) => {
  res.render("auth/profile", { title: "My Profile" });
});

// Submits a request to delete user from database
router.post("/profile", checkAuthenticated, async (req, res) => {
  console.log("Unsubscribing..." + user.name);
  try {
    await deleteUser(user.email);
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "Successfully Unsubscribed");
      profileIcon = null;
      user = null;
      res.redirect("/auth/login");
    });
  } catch (error) {
    req.flash("error2", "Oops, Something went wrong");
    console.error(error);
    res.redirect("/auth/profile");
  }
});

// routes that update account information
router.put("/profile/image", checkAuthenticated, async (req, res, next) => {
  console.log("Adding Profile Image");
  try {
    await addProfileImage(req.body.imageLink);
    profileIcon = req.body.imageLink;
    res.redirect("/auth/profile");
  } catch (error) {
    next(error);
  }
});

router.put("/profile/phone", checkAuthenticated, async (req, res, next) => {
  console.log("Adding Phone");
  try {
    await addPhone(req.body.phone);
    user.phone = req.body.phone;
    res.redirect("/auth/profile");
  } catch (error) {
    next(error);
  }
});

router.put("/profile/genre", checkAuthenticated, async (req, res, next) => {
  console.log("Adding Favorite Genre");
  try {
    await addGenre(req.body.genre);
    user.favorite_genre = req.body.genre;
    res.redirect("/auth/profile");
  } catch (error) {
    next(error);
  }
});

// route to display all previous reviews by the user
router.get("/profile/reviews", checkAuthenticated, async (req, res) => {
  try {
    const mongoReviews = await getMongoReviews(user.email);
    const postgresReviews = await getPostgresReviews(user.email);
    if (mongoReviews.length < 1 && postgresReviews.length < 1) {
      req.flash("error", "Sorry, you have no reviews");
      res.redirect("/auth/profile");
    }
    res.render("auth/reviews", {
      title: "My Reviews",
      mongoReviews,
      postgresReviews,
    });
  } catch (error) {
    console.error(error);
  }
});

// Route to call function to log out user
router.delete("/logout", (req, res, next) => {
  DEBUG && console.log("logout initialized");

  req.logout(function (error) {
    if (error) {
      return next(error);
    }
    profileIcon = null;
    user = null;
    res.redirect("/auth/login");
  });
});

module.exports = router;
