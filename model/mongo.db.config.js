const { MongoClient } = require("mongodb");
const uri = process.env.MONG_URI;
const pool = new MongoClient(uri);

module.exports = pool;
