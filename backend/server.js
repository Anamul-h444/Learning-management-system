const mongoose = require("mongoose");
// const Redis = require("ioredis");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;

/* Create Server */
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});

/* Connection with database */
const database = process.env.db_local;
//const database = process.env.db_atlas;
mongoose
  .connect(database)
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch(() => {
    console.log("connect Fail!");
  });

//Connection with radis
// const redisClient = () => {
//   if (process.env.REDIS_URL) {
//     console.log("Redis connected");
//     return process.env.REDIS_URL;
//   }
//   throw new Error("Radis connection failed");
// };
// new Redis(redisClient());

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
