const express = require("express");
const app = express();

require("./src/middleware/security")(app);
require("./src/middleware/routers")(app);

module.exports = app;
