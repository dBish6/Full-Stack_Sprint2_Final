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
let email = "alfie_allen@gameofthron.es";
// let password = "$2b$12$x574mziridS3mEQVTbKbY.lK.ngIDyZJnTw17G7Gk6n4lnWVSrWL.";
let password = "adsfiweio23r412kelfjiop";

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

const createUser = () => {};

const deleteUser = () => {};

// findUser(email, password);

module.exports = {
  findUser,
  createUser,
  deleteUser,
};
