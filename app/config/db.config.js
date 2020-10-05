module.exports = {
  // HOST: "127.4.188.2",
  HOST: "154.126.92.194",
  USER: "root",
  PASSWORD: "",
  DB: "testdb",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
