const {
  selectAllUsers,
  selectUserByUsername
} = require("../models/usersModel");

exports.getAllUsers = (req, resp, next) => {
  selectAllUsers()
    .then(users => {
      console.log("controller users", users);
      resp.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, resp, next) => {
  console.log("controller username", req.params);
  console.log("in users controller");
  const { username } = req.params;
  console.log("controller username", username);
  selectUserByUsername(username)
    .then(user => {
      console.log("controller user", user);
      resp.status(200).send({ user });
    })
    .catch(next);
};
