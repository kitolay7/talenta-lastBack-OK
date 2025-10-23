require('dotenv/config');

module.exports = {
  // HOST: "127.4.188.2",
  HOST: process.env.HOSTDB || "localhost",
  USER: process.env.USERDB || "talensa",
  PASSWORD: process.env.PASSWORDDB || "kitolay777",
  DB: process.env.DB || "talenta_db",
  dialect: "mysql",
  PORT: "3306",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
