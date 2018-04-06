const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());

const port = 8000;

require('../server/routes')(app, {});

if (app.listen(port)) {
	console.log("Live on port: " + port);
};

