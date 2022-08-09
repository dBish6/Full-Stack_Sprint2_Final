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

// Gets all movies from the sample_mflix MongoDb database and randomizes them by a limit of 50.
const displayAllMongoMovies = async () => {
  try {
    // Connects to the mongo database in function.
    await dal.connect();
    // Aggregate is a pipeline, in this case, the $sample operator randomizes through 50 documents.
    const cursor = dal
      .db("sample_mflix")
      .collection("movies")
      .aggregate([{ $sample: { size: 50 } }]);
    const data = await cursor.toArray();
    return data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { displayAllMongoMovies };
