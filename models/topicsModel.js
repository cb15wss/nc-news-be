const knex = require("../connection");

exports.selectTopics = () => {
  console.log("inside topics model");
  return knex("topics")
    .select("*")
    .then(topics => {
      // console.log("model topics are ", topics);
      return topics;
    });
};
