"use strict";

var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
module.exports = function (app) {
  // settings
  app.set("port", process.env.PORT || 3000);

  // middlewares
  app.use(_express["default"].json());

  // Allow connections from any IP address in the local network
  app.listen(app.get("port"), "0.0.0.0", function () {
    console.log("Server is running on http://0.0.0.0:".concat(app.get("port")));
  });
};