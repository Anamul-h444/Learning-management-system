const userRouter = require("../routes/userRouter");
const courseRouter = require("../routes/courseRouter");
const orderRouter = require("../routes/orderRouter");
const notificationRouter = require("../routes/notificationRouter");
const analyticsRouter = require("../routes/analyticsRouter");
const layoutRouter = require("../routes/layoutRouter");

module.exports = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/courses", courseRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/notification", notificationRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/layout", layoutRouter);

  app.use("*", (req, res) => {
    res.status(404).send("404 not found!");
  });
};
