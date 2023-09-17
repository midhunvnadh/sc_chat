// migrations/<timestamp>_migration_name.js
exports.up = function (knex) {
  return knex.schema.createTable("reg_details", function (table) {
    table.string("email").primary();
    table.string("role");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reg_details");
};
