const mongoose = require("mongoose");

let dbConnection;

async function connectDB() {
  try {
    if (dbConnection) {
      return dbConnection;
    }
    dbConnection = await mongoose.connect(process.env.MONGOOSE_URI);
    console.log("Connected To DB....");
    return dbConnection;
  } catch (e) {
    console.error("Error connecting to DB:", e.message);
    throw e;
  }
}



module.exports = { connectDB};