/*
    m.auth.dal.test.js

    Testing List of functions to create, delete and search for users

    Author: Chris Doucette
    Creaton Date: Monday August 10, 2022
    Updates:
    Date, Author, Description
    Aug 13 2022, Chris Doucette, Began updating testing to work with updated create, delete & search functions
    Aug 14 2022, Chris Doucette, Completed updating testing work with updated create, delete & search functions 
    Aug 15 2022, Chris Doucette, Added beforeAll to get db Connection & updated deleteUser to check for toBeUndefined()
    Aug 19 2022, Chris; Troubleshot why the deleteUser test was failing & made changes to the m.auth.dal.js file to fix issue of when no user is found in getUserByEmail
*/

const {
  getUserByEmail,
  deleteUser,
  addUser,
} = require("../model/controllers/m.auth.dal");

require("dotenv").config();
const dal = require("../model/mongo.db.config");

describe("Testing on some functions", () => {
  // Setting up db connection
  beforeAll(async () => {
    try {
      // const app = require("../server");
      await dal.connect();
      global.userCollection = dal.db("sample_mflix").collection("users");
      global.profileIcon = null;
      // global.user = user;
      global.DEBUG = false;
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    // Close Database here
    dal.close();
  });

  // Running tests below
  test("addUser function testing", async () => {
    //Test Criteria 1
    const userInfo = {
      name: "Test Tester",
      email: "test.test@testing.com",
      password: "123456789",
    };
    await addUser(userInfo);
    let user = await getUserByEmail(userInfo.email);
    // console.log(user);
    expect(user.email).toEqual(expect.stringMatching(userInfo.email));

    //Test Criteria 2
    let userInfo2 = {
      name: "Testing Tester",
      email: "test2.test2@testing.com",
      password: "123456789",
    };
    await addUser(userInfo2);
    let user2 = await getUserByEmail(userInfo2.email);
    expect(user2.email).toEqual(expect.stringMatching(userInfo2.email));
  });

  test("getUserByEmail function testing", async () => {
    let email = "test.test@testing.com";
    let user = await getUserByEmail(email);
    expect(user.email).toEqual(expect.stringMatching(email));

    email = "test2.test2@testing.com";
    user = await getUserByEmail(email);
    expect(user.email).toEqual(expect.stringMatching(email));
  });

  test("deleteUser function testing", async () => {
    // Deleting users created in addUser Test function
    // Test Criteria 1
    const userEmail1 = "test.test@testing.com";

    //Test Criteria 2
    const userEmail2 = "test2.test2@testing.com";

    // Searches for user by Email
    // Then deletes the search criteria
    // Then searches again to make sure search results are then undefined
    let user1 = await getUserByEmail(userEmail1);
    expect(user1.email).toBe(userEmail1);
    user1 = await deleteUser(userEmail1);
    user1 = await getUserByEmail(userEmail1);
    expect(user1).toBeUndefined();

    let user2 = await getUserByEmail(userEmail2);
    expect(user2.email).toBe(userEmail2);
    user2 = await deleteUser(userEmail2);
    user2 = await getUserByEmail(userEmail2);
    expect(user2).toBeUndefined();
  });
});
