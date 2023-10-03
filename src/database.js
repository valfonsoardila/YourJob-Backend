import Sequelize from "sequelize";
import fs from "fs";
import path from "path";

let db = null;

module.exports = (app) => {
  const config = app.libs.config;
  if (!db) {
    const sequelize=new Sequelize(
      config.database,
      null, // Deja en blanco el segundo parámetro para SQLite
      null, // Deja en blanco el tercer parámetro para SQLite
      config.params
    );
    db = {
      sequelize,
      Sequelize,
      models: {},
    };
    const dir = path.join(__dirname, "models");

    // Utiliza fs.readdirSync para leer los archivos en el directorio de modelos
    fs.readdirSync(dir).forEach((filename) => {
      const modelDir = path.join(dir, filename);
      // Importa los modelos utilizando `import` en lugar de `sequelize.import`
      const model = require(modelDir)(sequelize, Sequelize.DataTypes);
      // Agrega el modelo al objeto de modelos
      db.models[model.name] = model;
    });
    // Luego, asocia los modelos si es necesario (por ejemplo, definir relaciones)
    Object.values(db.models).forEach((model) => {
      if (model.associate) {
        model.associate(db.models);
      }
    });
  }
  return db;
};
