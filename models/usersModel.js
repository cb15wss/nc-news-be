const knex = require("../connection");

exports.selectAllUsers = () => {
  return knex("users")
    .select("*")
    .returning("*")
    .then(users => {
      // console.log("model users", users);
      return users;
    });
};

exports.selectUserByUsername = username => {
  //console.log("model username", username);
  return knex("users")
    .where("username", username)
    .then(result => {
      // console.log("model results", result.length);
      if (result.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "User does not exist"
        });
      } else {
        return result;
      }
    });
};
