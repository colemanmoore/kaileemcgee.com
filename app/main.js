var express = require('express');
var app = express();

app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

var htmlRoot = __dirname + '/public/views/';
var assetsRoot = __dirname + '/public/assets/';

var faqData = require('./faq.json');
var filmData = require('./film_links.json');
var filmDataFlat = flattenFilmData(filmData);

app
  .get('/', function (req, res) {
    res.render(htmlRoot + 'enter');
  })
  .get('/index.html', function(req, res) {
    res.render(htmlRoot + 'enter');
  })
  .get('/about.html.html', function(req, res) {
    res.render(htmlRoot + 'about');
  })
  .get('/contact.html', function(req, res) {
    res.render(htmlRoot + 'contact');
  })
  .get('/faq.html', function(req, res) {
    res.render(htmlRoot + 'faq', {
      data: faqData
    });
  })
  .get('/filmandvideo.html', function(req, res) {
    res.render(htmlRoot + 'filmandvideo', {
      data: filmData
    });
  })
  .get('/home.html', function(req, res) {
    res.render(htmlRoot + 'home');
  })
  .get('/music.html', function(req, res) {
    res.render(htmlRoot + 'music');
  })
  .get('/projects.html', function(req, res) {
    res.render(htmlRoot + 'projects');
  })
  .get('/promoslashindustry', function(req,res) {
    res.render(htmlRoot + 'promoslashindustry');
  })
  .get('/watch/:id', function(req, res) {
    console.log(filmDataFlat[req.params.id]);
    res.render(htmlRoot + 'watch', {
      embedCode: filmDataFlat[req.params.id]
    })
  })
  .get('/workshopsandseminars.html', function(req, res) {
    res.render(htmlRoot + 'workshopsandseminars');
  })

  .get(/.*\.pdf/, function(req,res) {
    var filename = req.originalUrl.split('/')[1];
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('content-type', 'application/pdf');
    res.sendFile(assetsRoot + filename);
  });


app.get('*', function(req, res) {
  res.status(404).sendFile(htmlRoot + '404.html')
});


// development error handler, will print stacktrace
if (app.get('env') === 'development') {

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
  });

} else {

  // production error handler, no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
  });
}

var port = process.env.PORT || 3333;

var server = app.listen(port, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('kaileemcgee.com listening at http://%s:%s', host, port);
});

function flattenFilmData(filmData) {
  var flat = {};
  filmData.forEach(function(section) {
    section.links.forEach(function(link) {
      if (!!link.id && !!link.embed) {

        if (Array.isArray(  link.embed)) {
          flat[link.id] = link.embed;
        } else {
          flat[link.id] = [link.embed];
        }
      }
    })
  });
  return flat;
}