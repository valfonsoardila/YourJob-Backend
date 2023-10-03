const bcrypt = require("bcrypt");

module.exports = (app) => {
  const Users = app.database.models.User;

  // Ruta para el registro de usuarios
  app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    Users.findOne({ where: { email } }).then((user) => {
      if (user) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Cifrar la contraseña antes de guardarla en la base de datos
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Crear un nuevo usuario
      Users.create({ name, email, password: hashedPassword })
        .then((newUser) => {
          res.json(newUser);
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    });
  });

  // Ruta para el inicio de sesión de usuarios
  app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Buscar al usuario por su dirección de correo electrónico
    Users.findOne({ where: { email } }).then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verificar la contraseña
      const passwordMatch = bcrypt.compareSync(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Generar un token JWT válido
      const token = jwt.sign({ id: user.id }, "your-secret-key");

      res.json({ token });
    });
  });
};
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "User",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 70],
          },
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 30],
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 20],
          },
        },
      },
      {}
    );
    User.associate = function (models) {
      // associations can be defined here
      User.hasMany(models.Task);
    };
    return User;
}