/*
    m.auth.dal.js

    List of functions to create, delete and search for users

    Author: Chris Doucette
    Creaton Date: Monday August 8, 2022
    Updates:
    Date, Author, Description

*/

const dal = require("../mongo.db.config");

// <Query functions from the database>

// Function to find / verify a user based on their email / password

//Testing Data
// let email = "alfie_allen@gameofthron.es";
// let password = "$2b$12$x574mziridS3mEQVTbKbY.lK.ngIDyZJnTw17G7Gk6n4lnWVSrWL.";
// let password = "adsfiweio23r412kelfjiop";

const findUser = async (email, password) => {
  try {
    await dal.connect();
    const searching = dal.db("sample_mflix").collection("users").findOne({
      email: email,
      password: password,
    });
    const userVerified = await searching;

    if (userVerified < 1) {
      console.log("User Not Found");
    } else {
      console.log(userVerified);
    }
  } catch (error) {
    console.error(error);
  }
};

// Function to Add user to Users Collection

// Testing data
// let name = "John Henry";
let email = "john_henry@myemail.com";
let password = "$2b$12$yGqxLG9LZpXA2xVDhuPnSOZd.VURVkz7wgOLY3pnO0s7u2S1ZO32y";

const createUser = async (name, email, password) => {
  // Checking if user already exists
  try {
    await dal.connect();
    const searching = dal.db("sample_mflix").collection("users").findOne({
      email: email,
    });
    const userVerified = await searching;

    if (userVerified < 1) {
      // User does not exist, adding to users
      try {
        await dal.connect();
        dal.db("sample_mflix").collection("users").insertOne({
          name: name,
          email: email,
          password: password,
        });
        console.log(`User has been added to Users collection!`);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("User already exists!");
    }
  } catch (error) {
    console.error(error);
  }
};

// Function to delete user from user collections

//Testing Data
// let email = "john_henry@myemail.com";
// let password = "$2b$12$yGqxLG9LZpXA2xVDhuPnSOZd.VURVkz7wgOLY3pnO0s7u2S1ZO32y";
const deleteUser = async () => {
  try {
    await dal.connect();
    const searching = dal.db("sample_mflix").collection("users").findOne({
      email: email,
      password: password,
    });

    const userToDelete = await searching;

    console.log(userToDelete);

    if (userToDelete < 1) {
      console.log(
        "No User with matches entered email and password combination"
      );
    } else {
      try {
        await dal.connect();
        dal.db("sample_mflix").collection("users").deleteOne({
          email: email,
          password: password,
        });
        console.log("User Deleted");
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

// findUser(email, password);
// createUser(name, email, password);
deleteUser(email, password);

module.exports = {
  findUser,
  createUser,
  deleteUser,
};
