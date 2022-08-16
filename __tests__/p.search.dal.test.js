/*
    p.search.dal.test.js

    Testing Postgress seearch bar function

    Author: Chris Doucette
    Creaton Date: Tuesday August 16, 2022
    Updates:
    Date, Author, Description
    
*/

const { titleSearch } = require("../model/controllers/p.search.dal");

require("dotenv").config();
const dal = require("../model/postgres.db.config");

describe("Testing Postgress search bar function", () => {
  afterAll(async () => {
    // Close Database connection at end of testing
    dal.end();
  });

  // Running tests below
  test("Postgress search bar function testing", async () => {
    // Test Criteria for 1 search result
    let search1 = "Dazed Punk";
    let test1 = await titleSearch(search1);
    expect(test1[0].title).toBe(search1);

    // Test Criteria for more than one search result
    let search2 = "Bed";
    let test2 = await titleSearch(search2);
    let results2 = [
      test2[0].title,
      test2[1].title,
      test2[2].title,
      test2[3].title,
    ];
    let expected2 = [
      "Bed Highball",
      "Bedazzled Married",
      "Borrowers Bedazzled",
      "Submarine Bed",
    ];
    expect(results2).toEqual(expect.arrayContaining(expected2));
  });
});
