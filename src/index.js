const express = require('express');
const pool = require('./Database/DBConnection');
require("dotenv-safe").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('./Routes/UserRoute'));

app.listen(3333);
console.log(`Server running on port 3333`);