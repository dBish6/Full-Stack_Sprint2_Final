/* 
   server.js
   List of functions for running the node express HTTP sever on LocalHost
   with routes for the following URL destinations on the server and for running the home page routes. 

   http://localhost:${PORT}/

   Author: David Bishop, Dominic Whelan, Chris Doucette and Blake Waddleton
   Creation Date: August 8, 2022
   Updates:
   Date, Author, Description
   Aug 8, 2022, Name, ...
   
*/

const { ObjectId } = require("mongodb");
const dal = require("../mongo.db.config");

// Can search by cast, fullplot, genres and title.
const fullSearch = async (text) => {
  await dal.connect();
  const cursor = dal
    .db("sample_mflix")
    .collection("movies")
    .find({ $text: { $search: text } });
  const data = await cursor.toArray();
  return data;
};

module.exports = { fullSearch };
