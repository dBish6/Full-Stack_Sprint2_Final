/*
    routes.test.js

    Testing routes for /search/mongo

    Author: Chris Doucette
    Creaton Date: Wednesday August 17, 2022
    Updates:
    Date,         Author, Description
    Aug 18 2022,  Chris;  Troubleshooting 503 error on /search/mongo & got /search/mongo/:_id working
    Aug 18 2022,  Chris;  Added global user so to get the /search/mongo to pass
    Aug 19 2022,  Chris;  Added user object to the /search/mongo route test instead of searching for user from DB
    
*/

const express = require("express");
const app = new express();

const router = require("../routes/search");
const router2 = require("../routes/auth");
const request = require("supertest");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use("/search", router);
app.use("/auth", router2);

require("dotenv").config();
const dal = require("../model/mongo.db.config");

describe("Testing various routes", () => {
  beforeAll(async () => {
    try {
      await dal.connect();
      // You actually don't need global here, it works somehow without it, but it makes sense having it there.
      global.movieCollection = dal.db("sample_mflix").collection("movies");
      global.userCollection = dal.db("sample_mflix").collection("users");
      global.commentCollection = dal.db("sample_mflix").collection("comments");
      global.profileIcon = null;
      global.DEBUG = true;
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    // Close Database here
    await dal.close();
  });

  test("responds to /search/mongo", async () => {
    let user = {
      name: "Tester Tester",
      email: "test@testing.com",
      password: "123456789",
    };
    // User is one of the default users in the sample_mflix users
    global.user = user;
    const res = await request(app).get("/search/mongo?search=Walk");
    console.log(res.header);
    expect(res.header["content-type"]).toMatch(/html/);
    expect(res.statusCode).toBe(200);
  });
});
