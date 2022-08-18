const express = require("express");
const app = new express();

const router = require("../routes/search");
const router2 = require("../routes/auth");
const request = require("supertest");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// const PORT = process.env.PORT || 4000;

app.use("/search", router);
app.use("/auth", router2);

// app.listen(PORT, "localhost", () => {
//   console.log(
//     `Server is running on http://localhost:${PORT}; Ctrl-C to terminate...`
//   );
// });

// describe("Good Home Routes", function () {
//   test("responds to /", async () => {
//     const res = await request(app).get("/");
//     console.log(res.text);
//     expect(res.header["content-type"]).toBe("text/html; charset=utf-8");
//     expect(res.statusCode).toBe(200);
//     // expect(res.header)
//   });
// });

// test("index router works", (done) => {
//   request(app)
//     .get("/")
//     .expect("Content-Type", "text/html; charset=utf-8")
//     .expect(200, done);
// });
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
    const res = await request(app).get("/search/mongo?search=Walk");
    console.log(res.header);
    expect(res.header["content-type"]).toMatch(/html/);
    expect(res.statusCode).toBe(200);
  });

  test("responds to /search/mongo/:_id", async () => {
    const res = await request(app).get(
      "/search/mongo/573a1395f29313caabce1282"
    );
    expect(res.header["content-type"]).toMatch(/html/);
    expect(res.statusCode).toBe(200);
  });
});
