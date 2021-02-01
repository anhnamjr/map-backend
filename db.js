const pg = require("pg");
const Pool = pg.Pool;

const connectionString = "postgres://fxqrsrogzkgigy:b523809b6d4d36196948ea4160f91828a5036c2d77657a3529a696e0221cb1a9@ec2-52-71-107-99.compute-1.amazonaws.com:5432/def7d3h4l1e4t0"

const pool =  new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})

// const pool = new Pool({
//   database: "def7d3h4l1e4t0",
//   user: "fxqrsrogzkgigy",
//   password: "b523809b6d4d36196948ea4160f91828a5036c2d77657a3529a696e0221cb1a9",
//   host: "ec2-52-71-107-99.compute-1.amazonaws.com",
//   port: 5432,
//   dialect: "postgres",
//   force: true,
// });

module.exports = {
  query: (text, params) => pool.query(text, params),
};
