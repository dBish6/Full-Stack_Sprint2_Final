/*
    m.auth.dal.js

    List of functions to create, delete and search for users

    Author: Chris Doucette
    Creaton Date: Monday August 8, 2022
    Updates:
    Date, Author, Description
    Aug 9 2022, Chris Doucette, Updated the findUser & createUser functions to work with MongoDB
    Aug 10 2022, Chris Doucette, Updated the deleteUser to work with MongoDB
    Aug 11 2022, Chris Doucette, After some jest testing adding a return false to deleteUser function
*/

const dal = require("../mongo.db.config");

// <Query functions from the database>

// Function to find / verify a user based on their email / password

const findUser = async (email, password) => {
  try {
    await dal.connect();
    const searching = dal.db("sample_mflix").collection("users").findOne({
      email: email,
      password: password,
    });
    const userVerified = await searching;

    if (userVerified < 1) {
      // console.log("User Not Found");
      return false;
    } else {
      // console.log(userVerified);
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Function to Add user to Users Collection
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
        // console.log(`User has been added to Users collection!`);
        return true;
      } catch (error) {
        console.error(error);
      }
    } else {
      // console.log("User already exists!");
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Function to delete user from user collections

//Testing Data
const deleteUser = async (name, email, password) => {
  try {
    await dal.connect();
    const searching = dal.db("sample_mflix").collection("users").findOne({
      name: name,
      email: email,
      password: password,
    });

    const userToDelete = await searching;

    // console.log(userToDelete);

    if (userToDelete < 1) {
      // console.log(
      //   "No User with matches entered email and password combination"
      // );
      return false;
    } else {
      try {
        await dal.connect();
        dal.db("sample_mflix").collection("users").deleteOne({
          name: name,
          email: email,
          password: password,
        });
        // console.log("User Deleted");
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = {
  findUser,
  createUser,
  deleteUser,
};
