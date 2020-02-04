const knex = require("../connection");

exports.getAllArticles = () => {
  console.log("in articles model");
  return knex("articles")
    .select("*")
    .returning("*")
    .then(results => {
      console.log("results in article model ", results);
      return results;
    });
};
