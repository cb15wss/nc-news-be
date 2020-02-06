const {
  selectAllUsers,
  selectUserByUsername
} = require("../models/usersModel");

exports.getAllUsers = (req, resp, next) => {
  selectAllUsers()
    .then(users => {
      resp.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, resp, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then(user => {
      resp.status(200).send({ user });
    })
    .catch(next);
};
