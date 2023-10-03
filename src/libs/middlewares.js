import express from "express";
module.exports = (app) => {
  // settings
  app.set("port", 3000);
  
  // middlewares
  app.use(express.json());

  // Allow connections from any IP address in the local network
  app.listen(app.get("port"), "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${app.get("port")}`);
  });
};