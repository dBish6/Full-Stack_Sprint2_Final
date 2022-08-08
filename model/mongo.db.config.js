const { MongoClient } = require("mongodb");
const uri = process.env.MONG_URI;
// const uri =
//   "mongodb+srv://cdouce:<>@cluster0.gvbnhiu.mongodb.net/?retryWrites=true&w=majority";
const pool = new MongoClient(uri);

module.exports = pool;
