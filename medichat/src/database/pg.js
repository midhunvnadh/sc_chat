const url = require("url");
import fs from "fs";
import { Pool } from "pg";
const params = url.parse(process.env.DB_URL);
const auth = params.auth.split(":");

import knexConfig from "../../knexfile";

const cert = knexConfig.development.connection.ssl.ca;

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split("/")[1],
  ssl: {
    rejectUnauthorized: false,
    ca: cert,
  },
};

const pool = new Pool(config);
export default pool;
