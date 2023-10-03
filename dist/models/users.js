"use strict";

var bcrypt = require("bcrypt");
module.exports = function (app) {
  var Users = app.database.models.User;

  // Ruta para el registro de usuarios
  app.post("/register", function (req, res) {
    var _req$body = req.body,
      name = _req$body.name,
      email = _req$body.email,
      password = _req$body.password;

    // Verificar si el usuario ya existe
    Users.findOne({
      where: {
        email: email
      }
    }).then(function (user) {
      if (user) {
        return res.status(400).json({
          error: "User already exists"
        });
      }

      // Cifrar la contraseña antes de guardarla en la base de datos
      var hashedPassword = bcrypt.hashSync(password, 10);

      // Crear un nuevo usuario
      Users.create({
        name: name,
        email: email,
        password: hashedPassword
      }).then(function (newUser) {
        res.json(newUser);
      })["catch"](function (error) {
        res.status(500).json({
          error: error.message
        });
      });
    });
  });

  // Ruta para el inicio de sesión de usuarios
  app.post("/login", function (req, res) {
    var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password;

    // Buscar al usuario por su dirección de correo electrónico
    Users.findOne({
      where: {
        email: email
      }
    }).then(function (user) {
      if (!user) {
        return res.status(404).json({
          error: "User not found"
        });
      }

      // Verificar la contraseña
      var passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({
          error: "Invalid password"
        });
      }

      // Generar un token JWT válido
      var token = jwt.sign({
        id: user.id
      }, "your-secret-key");
      res.json({
        token: token
      });
    });
  });
};
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 70]
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 30]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 20]
      }
    }
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Task);
  };
  return User;
};