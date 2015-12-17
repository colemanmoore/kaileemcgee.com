var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var htmlRoot = __dirname + '/public/html/';

app
  .get('/', function (req, res, next) {
    res.sendFile(htmlRoot + 'enter.html');
  })
  .get('/index.html', function(req, res, next) {
    res.sendFile(htmlRoot + 'enter.html');
  })
  .get('/about.html.html', function(req, res, next) {
    res.sendFile(htmlRoot + 'about.html.html');
  })
  .get('/contact.html', function(req, res, next) {
    res.sendFile(htmlRoot + 'contact.html');
  })
  .get('/faq.html', function(req, res, next) {
    res.sendFile(htmlRoot + 'faq.html');
  })
  .get('/filmandvideo.html', function(req, res, next) {
    res.sendFile(htmlRoot + 'filmandvideo.html');
  })
  .get('/home.html', function(req, res, next) {
    res.sendFile(htmlRoot + 'home.html');
  })
  .get('/music.html', function(req, res, next) {
    res.sendFile(htmlRoot + 'music.html');
  })
  .get('/projects.html', function(req, res, next) {
    res.sendFile(htmlRoot + 'projects.html');
  })
  .get('/watch', function(req, res, next) {
    res.sendFile(htmlRoot + 'watch.html')
  })
  .get('/workshopsandseminars.html', function(req, res, next) {
    res.sendFile(htmlRoot + 'workshopsandseminars.html');
  });


app.get('/videodata', function(req, res, next) {
  res.sendFile(__dirname + '/film_links.json');
});


app.get('*', function(req, res) {
  res.status(404).sendFile(htmlRoot + '404.html')
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var port = (process.env.NODE_ENV==='production' ? 8081 : 3333);

var server = app.listen(port, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('kaileemcgee.com listening at http://%s:%s', host, port);
});