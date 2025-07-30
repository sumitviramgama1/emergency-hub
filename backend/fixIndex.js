const mongoose = require("mongoose");
require("dotenv").config();

const run = async () => {
  try {
    const dbUrl = process.env.MONGODB_URI;
await mongoose.connect(dbUrl);
console.log("Connected to MongoDB");

    console.log("Connected to DB");
    const result = await mongoose.connection.db.collection("users").dropIndex("email_1");
    console.log("Dropped index:", result);

    await mongoose.disconnect();
    console.log("Done");
  } catch (err) {
    console.error("Error:", err.message);
  }
};

run();
