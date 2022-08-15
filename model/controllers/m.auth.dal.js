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

// function is not used, delete? Dominic Aug.14/22
const getUsers = async () => {
  try {
    await dal.connect();
    const searching = dal
      .db("sample_mflix")
      .collection("users")
      .find()
      .toArray();
    const users = await searching;

    if (users < 1) {
      console.log("Could not get Users");
    } else {
      console.log("Users Get Success");
      return users;
    }
  } catch (error) {
    console.error(error);
  }
};

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

async function getUserByEmail(email) {
  DEBUG && console.log("getUserByEmail(" + email + ")");
  try {
    const user = await userCollection.findOne({ email: email });
    global.user = user;

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

// Add fields to user document
async function addProfileImage(link) {
  try {
    await userCollection.updateOne(
      { _id: user._id },
      { $addToSet: { image: `${link}` } }
    );
    DEBUG && console.log("Profile Image added to UserId: " + user._id);
  } catch (err) {
    console.log(err);
  }
}
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
  getUsers,
  getUserByEmail,
  getUserById,
  addUser,
  deleteUser,
  addProfileImage,
  checkAuthenticated,
  checkNotAuthenticated,
};

// <Query functions from the database>

// Function to find / verify a user based on their email / password

// const findUser = async (email, password) => {
//   try {
//     await dal.connect();
//     const searching = dal.db("sample_mflix").collection("users").findOne({
//       email: email,
//       password: password,
//     });
//     const userVerified = await searching;

//     if (userVerified < 1) {
//       console.log("User Not Found");
//       return false;
//     } else {
//       console.log(userVerified);
//       return true;
//     }
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// };

// Function to Add user to Users Collection
// const createUser = async (name, email, password) => {
//   // Checking if user already exists
//   try {
//     await dal.connect();
//     const searching = dal.db("sample_mflix").collection("users").findOne({
//       email: email,
//     });
//     const userVerified = await searching;

//     if (userVerified < 1) {
//       // User does not exist, adding to users
//       try {
//         await dal.connect();
//         dal.db("sample_mflix").collection("users").insertOne({
//           name: name,
//           email: email,
//           password: password,
//         });
//         console.log(`User has been added to Users collection!`);
//         return true;
//       } catch (error) {
//         console.error(error);
//       }
//     } else {
//       console.log("User already exists!");
//       return false;
//     }
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// };
// 123456789123456789;

// Function to delete user from user collections

//Testing Data
// const deleteUser = async (name, email, password) => {
//   try {
//     await dal.connect();
//     const searching = dal.db("sample_mflix").collection("users").findOne({
//       name: name,
//       email: email,
//       password: password,
//     });

//     const userToDelete = await searching;

//     console.log(userToDelete);

//     if (userToDelete < 1) {
//       console.log(
//         "No User with matches entered email and password combination"
//       );
//     } else {
//       try {
//         await dal.connect();
//         dal.db("sample_mflix").collection("users").deleteOne({
//           name: name,
//           email: email,
//           password: password,
//         });
//         console.log("User Deleted");
//         return true;
//       } catch (error) {
//         console.error(error);
//         return false;
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// };

// module.exports = {
//   findUser,
//   createUser,
//   deleteUser,
// };
