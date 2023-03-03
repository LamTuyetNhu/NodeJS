import mysql from "mysql2/promise";

var pool = mysql.createPool({
  host: "localhost",
  port: 3307,
  user: "root",
  database: "nodejs",
});

module.exports = pool;
