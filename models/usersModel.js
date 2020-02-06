const knex = require("../connection");

exports.selectAllUsers = () => {
  return knex("users")
    .select("*")
    .returning("*")
    .then(users => {
      return users;
    });
};

exports.selectUserByUsername = username => {
  return knex("users")
    .where("username", username)
    .then(([user]) => {
      if (user === undefined) {
        return Promise.reject({
          status: 404,
          msg: "User does not exist"
        });
      } else {
        return user;
      }
    });
};
