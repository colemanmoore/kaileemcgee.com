/* server.js - Express Server */

var
  path = require('path'),
  express = require('express'),
  app = express(),
  env = app.get('NODE_ENV') || process.env.NODE_ENV || 'production';

app.set('port', process.env.PORT || 3333);
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'src/views'));

// CSS and JS come from ../dist
app.use('/static', express.static(path.join(__dirname, '../dist')));

// Images from public/
app.use('/', express.static(__dirname + '/public'));

// Inject live reload in development mode
if (env === 'development') {
  app.use(require('connect-livereload')({
    port: process.env.LR_PORT
  }));
}

// Listen
var server = app.listen(app.get('port'), '0.0.0.0', function () {
  console.log('kaileemcgee.com listening at http://%s:%s', server.address().address, server.address().port);
});

// Routing in routes.js
require('./routes.js').route(app);
