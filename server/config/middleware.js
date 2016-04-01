'use strict';

var bodyParser = require('body-parser');

module.exports = function (app, express){
  var homeRouter = express.Router();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use(express.static(__dirname + '/../../client'));
  app.use('/api/router', homeRouter);

  // TODO: build home router
  // require('../home/HomeRoutes.js')(homeRouter);
};