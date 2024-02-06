const mongoose = require("mongoose");

const databaseUrl = process.env.DATABASE_URL;
const connect = mongoose.connect(databaseUrl);
connect.then(() => {
  console.log("db furnics connected");
});
module.exports = connect;
