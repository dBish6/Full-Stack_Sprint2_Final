/* 
   m.movies.dal.js
   Houses functions that has to do with movies from the movies collection in MongoDb.
   displayAllMongoMovies() - takes all records from the movie collection and randomizes them by a limit of 50.

   Author: David Bishop, Dominic Whelan, Chris Doucette and Blake Waddleton
   Creation Date: August 8, 2022
   Updates:
   Date, Author, Description
   Aug 8, 2022, David; implemented first version of displayAllMongoMovies function.
   Aug 9, 2022, David; implemented a new version of displayAllMongoMovies() with the global collection varaible and more short hand.
   Aug 10, 2022, David; added getMongoMovieDetails function.
   
*/

const { ObjectId } = require("mongodb");

// Gets all movies from the sample_mflix MongoDb database and randomizes them by a limit of 50.
const displayAllMongoMovies = async () => {
  try {
    // Aggregate is a pipeline, in this case, the $sample operator randomizes through 50 documents.
    return await movieCollection
      .aggregate([{ $sample: { size: 50 } }])
      .toArray();
  } catch (error) {
    console.error(error);
  }
};

const getMongoMovieDetails = async (_id) => {
  try {
    return await movieCollection.find({ _id: ObjectId(`${_id}`) }).toArray();
  } catch (error) {
    console.error(error);
  }
};

module.exports = { displayAllMongoMovies, getMongoMovieDetails };
