const fs = require("fs");
require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      connectionString: process.env.DB_URL,
      ssl: {
        ca: fs.readFileSync(`src/database/ca-certificate.crt`),
      },
    },
    ssl: true,
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },
};
