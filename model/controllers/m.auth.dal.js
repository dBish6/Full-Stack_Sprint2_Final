/*
    m.auth.dal.js

    List of functions to create, delete and search for users

    Author: Chris Doucette
    Creaton Date: Monday August 8, 2022
    Updates:
    Date, Author, Description
    Aug 9 2022, Chris Doucette, Updated the findUser & createUser functions to work with MongoDB
    Aug 10 2022, Chris Doucette, Updated the deleteUser to work with MongoDB
    Aug 11 2022, Dominic Whelan, Function additions and edits
    Aug 13 2022, Dominic Whelan, Fixed getUserById() by requiring "ObjectId" from mongodb
    Aug 14 2022, Dominic Whelan, cleaned up code
*/

const dal = require("../mongo.db.config");
const { ObjectId } = require("mongodb");

async function addUser(user) {
  try {
    await userCollection.insertOne(user);
  } catch (err) {
    console.log(err);
  }
}

async function deleteUser(email) {
  try {
    DEBUG && console.log("Deleting..." + email);
    await userCollection.deleteOne({ email: `${email}` });
  } catch (err) {
    console.log(err);
  }
}

// Function used for authentication, Retreival of user info
async function getUserByEmail(email) {
  // DEBUG && console.log(email);
  try {
    const user = await userCollection.findOne({ email: email });
    global.user = user;
    global.profileIcon = user.image;

    if (user === null) {
      console.log("getUserByEmail() Could not get User");
    } else {
      console.log("User Found");
      return user;
    }
  } catch (err) {
    console.log(err);
  }
}

// Function used for Passport
async function getUserById(id) {
  DEBUG && console.log(id);
  const par = ObjectId(`${id}`);
  try {
    const user = await userCollection.findOne({ _id: par });
    DEBUG && console.log(user);

    if (user === null) {
      console.log("Could not get User");
    } else {
      console.log("User Found");
      return user;
    }
  } catch (err) {
    console.log(err);
  }
}

// Add Image Url to user document
async function addProfileImage(link) {
  try {
    await userCollection.updateOne(
      { _id: user._id },
      { $set: { image: `${link}` } }
    );
    DEBUG && console.log("Profile Image added to UserId: " + user._id);
  } catch (err) {
    console.log(err);
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
  } catch (err) {
    console.log(err);
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
  } catch (err) {
    console.log(err);
  }
}
// Middleware functions to allow/block access to routes
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
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
  checkAuthenticated,
  checkNotAuthenticated,
};
