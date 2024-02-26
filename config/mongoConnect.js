// const { logger } = require("handlebars");
const mongoose = require("mongoose");
const logger =require("../util/winston")

const databaseUrl = process.env.DATABASE_URL;
const connect = mongoose.connect(databaseUrl);
connect.then(() => {
  console.log("db furnics connected");
  logger.info('database connection success')
});
module.exports = connect;
