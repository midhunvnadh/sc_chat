// migrations/<timestamp>_migration_name.js
exports.up = function (knex) {
  return knex.schema.createTable("doctors", function (table) {
    table.string("d_name");
    table.string("email").primary();
    table.string("license", 1000000);
    table.string("specialization");
    table.integer("pincode");
    table.integer("verified").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("doctors");
};
