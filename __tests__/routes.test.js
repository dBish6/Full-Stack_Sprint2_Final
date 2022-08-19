/*
    routes.test.js

    Testing routes for /search/mongo

    Author: Chris Doucette
    Creaton Date: Wednesday August 17, 2022
    Updates:
    Date,         Author,           Description
    Aug 18 2022,  Chris Doucette,   Troubleshooting 503 error on /search/mongo & got /search/mongo/:_id working
    Aug 18 2022,  Chris Doucette,   Added global user so to get the /search/mongo to pass
    
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

const { getUserById } = require("../model/controllers/m.auth.dal");

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
    // User is one of the default users in the sample_mflix users
    global.user = await getUserById("59b99dbacfa9a34dcd7885c1");
    const res = await request(app).get("/search/mongo?search=Walk");
    console.log(res.header);
    expect(res.header["content-type"]).toMatch(/html/);
    expect(res.statusCode).toBe(200);
  });

  test("responds to /search/mongo/:_id", async () => {
    const res = await request(app).get(
      "/search/mongo/573a13d7f29313caabda16ef"
    );
    expect(res.header["content-type"]).toMatch(/html/);
    expect(res.statusCode).toBe(200);
  });
});
