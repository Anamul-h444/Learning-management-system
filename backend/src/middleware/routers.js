const userRouter = require("../routes/userRouter");
const courseRouter = require("../routes/courseRouter");

module.exports = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/courses", courseRouter);

  app.use("*", (req, res) => {
    res.status(404).send("404 not found!");
  });
};
