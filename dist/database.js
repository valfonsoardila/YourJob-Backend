"use strict";

var _sequelize = _interopRequireDefault(require("sequelize"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var db = null;
module.exports = function (app) {
  var config = app.libs.config;
  if (!db) {
    var sequelize = new _sequelize["default"](config.database, null,
    // Deja en blanco el segundo parámetro para SQLite
    null,
    // Deja en blanco el tercer parámetro para SQLite
    config.params);
    db = {
      sequelize: sequelize,
      Sequelize: _sequelize["default"],
      models: {}
    };
    var dir = _path["default"].join(__dirname, "models");

    // Utiliza fs.readdirSync para leer los archivos en el directorio de modelos
    _fs["default"].readdirSync(dir).forEach(function (filename) {
      var modelDir = _path["default"].join(dir, filename);
      // Importa los modelos utilizando `import` en lugar de `sequelize.import`
      var model = require(modelDir)(sequelize, _sequelize["default"].DataTypes);
      // Agrega el modelo al objeto de modelos
      db.models[model.name] = model;
    });
    // Luego, asocia los modelos si es necesario (por ejemplo, definir relaciones)
    Object.values(db.models).forEach(function (model) {
      if (model.associate) {
        model.associate(db.models);
      }
    });
  }
  return db;
};