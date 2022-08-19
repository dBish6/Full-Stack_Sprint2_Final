/*  m.auth.dal.js

    List of functions to create, delete and search for users.
    Basically everything that has to deal with users.

    http://localhost:${PORT}/auth

    Author: Chris Doucette
    Creaton Date: Monday August 8, 2022
    Updates:
    Date, Author, Description
    Aug 9 2022, Chris Doucette; Updated the findUser & createUser functions to work with MongoDB.
    Aug 10 2022, Chris Doucette; Updated the deleteUser to work with MongoDB.
    Aug 11 2022, Dominic Whelan; Function additions and edits.
    Aug 13 2022, Dominic Whelan; Fixed getUserById() by requiring "ObjectId" from mongodb.
    Aug 14 2022, Dominic Whelan; cleaned up code.
    Aug 17 2022, David; added the addReview function.
    Aug 17 2022, Dominic; getReviews() function added
    Aug 18 2022, Dominic; Edited error messages, comments, minor edits
    Aug 19 2033, Chris; Changes the getUserByEmail so the global.profileIcon would get assigned after the check that the search found a user 
*/

const dal = require("../postgres.db.config");
const { ObjectId } = require("mongodb");

// Function used when registering new user
async function addUser(user) {
  try {
    await userCollection.insertOne(user);
  } catch (error) {
    console.error(error);
  }
}

// Unsubscribe function, deletes from database
async function deleteUser(email) {
  try {
    DEBUG && console.log("Deleting..." + email);
    await userCollection.deleteOne({ email: `${email}` });
  } catch (error) {
    console.error(error);
  }
}

// Function used for authentication, Retreival of user info
async function getUserByEmail(email) {
  DEBUG && console.log("getUserByEmail() searching: " + email);
  try {
    const user = await userCollection.findOne({ email: email });
    global.user = user;

    if (user === null) {
      console.log("getUserByEmail() FAILED: Could not get User");
    } else {
      global.profileIcon = user.image;
      DEBUG && console.log("getUserByEmail() SUCCESS: User Found");
      return user;
    }
  } catch (error) {
    console.error(error);
  }
}

// Function used for Passport
async function getUserById(id) {
  DEBUG && console.log("getUserById() searching: " + id);

  // Defined object parameter to pass into database query
  const par = ObjectId(`${id}`);

  try {
    const user = await userCollection.findOne({ _id: par });
    DEBUG && console.log(user);

    if (user === null) {
      console.log("getUserById() FAILED: Could not get User");
    } else {
      DEBUG && console.log("getUserById() SUCCESS: User Found");
      return user;
    }
  } catch (error) {
    console.error(error);
  }
}

// Adding extra Account information
async function addProfileImage(link) {
  try {
    await userCollection.updateOne(
      { _id: user._id },
      { $set: { image: `${link}` } }
    );
    DEBUG && console.log("Profile Image added to UserId: " + user._id);
    user.image = link;
  } catch (error) {
    console.error(error);
  }
}

async function addPhone(text) {
  try {
    await userCollection.updateOne(
      { _id: user._id },
      { $set: { phone: `${text}` } }
    );
    DEBUG &&
      console.log("Phone number: " + text + " added to UserId: " + user._id);
  } catch (error) {
    console.error(error);
  }
}

async function addGenre(text) {
  try {
    await userCollection.updateOne(
      { _id: user._id },
      { $set: { favorite_genre: `${text}` } }
    );
    DEBUG &&
      console.log(
        "Favorite genre: " + text + " updated for UserId: " + user._id
      );
  } catch (error) {
    console.error(error);
  }
}

// To add a review to the collection.
const addReview = async (userReview) => {
  try {
    return await commentCollection.insertOne(userReview);
  } catch (error) {
    console.error(error);
  }
};

const getMongoReviews = async (email) => {
  try {
    result = await commentCollection.find({ email: email }).toArray();
  } catch (error) {
    console.error(error);
  }
  return result;
};

const getPostgresReviews = async (email) => {
  let response;
  try {
    response = await dal.query("SELECT * FROM review WHERE email = $1;", [
      email,
    ]);
    return response.rows;
  } catch (error) {
    console.error(error);
  }
};

// Middleware functions to allow/block access to routes

// Used to block unathunticated users (app content e.g. homepage)
function checkAuthenticated(req, res, next) {
  // If user is authenticated this will allow request
  if (req.isAuthenticated()) {
    return next();
  }
  // If user is not authenticated re-route to login
  res.redirect("/auth/login");
}

// Used to block athunticated users (e.g. login, register)
function checkNotAuthenticated(req, res, next) {
  // If user is authenticated re-route to homepage
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  // If user is not authenticated allow request
  next();
}

module.exports = {
  getUserByEmail,
  getUserById,
  addUser,
  deleteUser,
  addProfileImage,
  addPhone,
  addGenre,
  addReview,
  getMongoReviews,
  getPostgresReviews,
  checkAuthenticated,
  checkNotAuthenticated,
};
