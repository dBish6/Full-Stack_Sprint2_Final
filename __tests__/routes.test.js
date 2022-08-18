const express = require("express");
const app = new express();

const router = require("../routes/search");
const request = require("supertest");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// const PORT = process.env.PORT || 4000;

app.use("/search", router);
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

test("responds to /search/mongo", async () => {
  const res = await request(app).get("/search/mongo/");
  console.log(res.header);
  expect(res.header["content-type"]).toMatch(/html/);
  expect(res.statusCode).toBe(200);
});
