import express from "express";
import APIController from "../controller/APIController";
let router = express.Router();

const initAPIRoute = (app) => {
  //method GET -> READ dataUser
  router.get("/users", APIController.getAllUsers);
  //method POST -> CREATE dataUser
  router.post("/create-user", APIController.createNewUser);
  //method PUT -> UPDATE dataUser
  router.put("/update-user", APIController.updateUser);
  //method DELETE -> DELETE dataUser
  router.delete("/delete-user/:id", APIController.deleteUser);

  return app.use("/api/v1", router);
};

// module.exports = initWebRoute;
export default initAPIRoute;
