const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const router = require("./routes/router")

const app = express();

const PORT = 3000;

app.use(cors());
// app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use('/', router)

app.listen(PORT, () => {
  console.log(`App listen port ${PORT}`);
});