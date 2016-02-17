var express = require('express');
var app = express();

app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

var htmlRoot = __dirname + '/public/views/';

var faqData = require('./data/faq.json');
var filmData = require('./data/film_links.json');
var filmDataFlat = flattenFilmData(filmData);
var photoData = require('./data/photo.json');
var livingToPost = require('./data/livingtopost.json');

app
  .get(['/', '/index.html'], function (req, res) {
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
  .get('/photography/displayimage.php', function(req, res) {

    var album = photoData[0].photos;
    var vars = {
      album: album,
      position: req.query.position || 0
    };
    res.render(htmlRoot + 'gallery', vars);
  })
  .get(['/photography.html', '/photography/', '/photography/thumbnails.php'], function(req, res) {

    var album = photoData[0];
    var vars = {
      album: album
    };
    res.render(htmlRoot + 'thumbnails', vars);

  })
  .get('/photography/nextthumb.php', function(req, res) {
    var album = req.param.album || 0;
    var position = req.query.pos;
    if (!!position) {
      res.json(photoData[album].photos[position]);
    } else {
      res.status(400).send({
        error: 'Request missing position parameter'
      })
    }
  })
  .get('/projects.html', function(req, res) {
    res.render(htmlRoot + 'projects', {
      livingToPost: livingToPost
    });
  })
  .get('/promoslashindustry', function(req,res) {
    res.render(htmlRoot + 'promoslashindustry');
  })
  .get('/testimonials.html', function(req, res) {
    res.render(htmlRoot + 'testimonials');
  })
  .get('/watch/:id', function(req, res) {
    res.render(htmlRoot + 'watch', {
      embedCode: filmDataFlat[req.params.id]
    })
  })
  .get('/workshopsandseminars.html', function(req, res) {
    res.render(htmlRoot + 'workshopsandseminars');
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