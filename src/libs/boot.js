module.exports = (app) => {
  app.database.sequelize.sync().then(() => {
    app.listen(app.get("port"), () => {
      console.log("Server on port", app.get("port"));
    });
  });
};
