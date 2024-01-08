require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const { DB_PORT_DEV, DB_MONGO_URL } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_MONGO_URL)
  .then(() => {
    app.listen(DB_PORT_DEV);
    console.log("Database connection successful");
  })
  .catch((error) => console.log(error.message));
