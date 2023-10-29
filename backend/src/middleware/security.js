const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

module.exports = (app) => {
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(cookieParser());
};
