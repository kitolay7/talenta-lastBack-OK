module.exports = {
  // HOST: "127.4.188.2",
  HOST: "127.0.0.1",
  USER: "root",
  // PASSWORD: "",
  PASSWORD: "root",
  DB: "testdb",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
