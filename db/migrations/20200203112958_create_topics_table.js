exports.up = function(knex) {
  return knex.schema.createTable("topics", topicsTable => {
    //console.log("creating topics table");
    topicsTable
      .string("slug")
      .unique()
      .notNullable()
      .primary();
    topicsTable.text("description").notNullable();
  });
};

exports.down = function(knex) {
  // console.log("dropping topics table");
  return knex.schema.dropTable("topics");
};
