const cardRoutes = require('./routes.js');

module.exports = (app, db) => {
	cardRoutes(app, db);
};