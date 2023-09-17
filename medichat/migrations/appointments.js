// migrations/<timestamp>_migration_name.js
exports.up = function (knex) {
  return knex.schema.createTable("appointments", function (table) {
    table.increments("id").unique();
    table.string("p_email");
    table.string("d_email");
    table.integer("meeting_mode");
    table.string("meeting_details");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("accepted_meeting_ts");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("appointments");
};
