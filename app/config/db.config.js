require('dotenv/config');

module.exports = {
  // HOST: "127.4.188.2",
  HOST: process.env.HOSTDB || "remotemysql.com",
  USER: process.env.USERDB || "rtiQxD4A8F",
  PASSWORD: process.env.PASSWORDDB || "TJyPqrM399",
  DB: process.env.DB || "rtiQxD4A8F",
  dialect: "mysql",
  PORT: "3306",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
