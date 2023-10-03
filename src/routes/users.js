const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = (app) => {
  const Users = app.database.models.User; // Asegúrate de que "app" tenga una propiedad "db" definida
  app.route("/users").get((req, res) => {
    Users.findAll({})
      .then((result) => res.json(result))
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
  });
  app.route("/users").post(async (req, res) => {
    try {
      const user = await Users.create(req.body);
      // Genera un token JWT con la información del usuario
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
        expiresIn: '30m' // Puedes ajustar la duración del token según tus necesidades
      });
      res.json({ user, token });
    } catch (error) {
      res.status(412).json({ msg: error.message });
    }
  });
  app.route("/users/:id").get((req, res) => {
    Users.findOne({ where: req.params })
      .then((result) => {
        if (result) {
          res.json(result);
        } else {
          res.sendStatus(404);
        }
      })
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
  });
  app.route("/users/:id").put((req, res) => {
    Users.update(req.body, { where: req.params })
      .then((result) => res.sendStatus(204))
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
  });
  app.route("/users/:id").delete((req, res) => {
    Users.destroy({ where: req.params })
      .then((result) => res.sendStatus(204))
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
  });

};
