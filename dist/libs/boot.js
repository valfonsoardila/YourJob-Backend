"use strict";

module.exports = function (app) {
  app.database.sequelize.sync().then(function () {
    app.listen(app.get("port"), function () {
      console.log("Server on port", app.get("port"));
    });
  });
};