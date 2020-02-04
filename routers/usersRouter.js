const usersRouter = require("express").Router();

const {
  getAllUsers,
  getUserByUsername
} = require("../controllers/usersController");
const { badMethod } = require("../errors/errors");

usersRouter
  .route("/")
  .get(getAllUsers)
  .all(badMethod);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(badMethod);

module.exports = usersRouter;
