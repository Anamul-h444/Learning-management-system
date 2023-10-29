const mongoose = require("mongoose");
const Redis = require("ioredis");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();

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
const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log("Redis connected");
    return process.env.REDIS_URL;
  }
  throw new Error("Radis connection failed");
};

new Redis(redisClient());
