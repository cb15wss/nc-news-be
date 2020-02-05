const knex = require("../connection");

exports.checkIfExists = (table, column, value) => {
  return knex
    .select(column)
    .from(table)
    .where({ [column]: value })
    .then(response => {
      if (!response.length) {
        return Promise.reject({
          status: 404,
          msg: `"${value}" not found`
        });
      } else {
        return true;
      }
    });
};
