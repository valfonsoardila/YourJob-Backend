"use strict";

var jwt = require("jsonwebtoken");
module.exports = function (app) {
  var Tasks = app.database.models.Task;

  // Ruta protegida que requiere un token JWT válido
  app.get("/tasks", function (req, res) {
    var token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        error: "Missing token"
      });
    }

    // Verificar y decodificar el token JWT
    jwt.verify(token, "your-secret-key", function (error, decoded) {
      if (error) {
        return res.status(401).json({
          error: "Invalid token"
        });
      }

      // El token es válido, se puede acceder a las funcionalidades protegidas
      Tasks.findAll({}).then(function (result) {
        return res.json(result);
      })["catch"](function (error) {
        res.status(500).json({
          error: error.message
        });
      });
    });
  });
};
module.exports = function (sequelize, DataTypes) {
  var Task = sequelize.define("Task", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 80]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 600]
      }
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 12]
      }
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Task.associate = function (models) {
    // associations can be defined here
    Task.belongsTo(models.User);
  };
  return Task;
};