/* routes.js */

module.exports = {

  route: function(app) {

    var faqData = require('./data/faq.json');
    var photoData = require('./data/photo.json');
    var livingToPost = require('./data/livingtopost.json');
    var filmData = require('./data/film_links.json');
    var filmDataFlat = flattenFilmData(filmData);
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

    app

      .get(['/', '/index.html'], function (req, res) {
        res.render('enter');
      })

      .get('/about.html.html', function(req, res) {
        res.render('about');
      })

      .get('/contact.html', function(req, res) {
        res.render('contact');
      })

      .get('/faq.html', function(req, res) {
        res.render('faq', {
          data: faqData
        });
      })

      .get('/filmandvideo.html', function(req, res) {
        res.render('filmandvideo', {
          data: filmData
        });
      })

      .get('/home.html', function(req, res) {
        res.render('home');
      })

      .get('/music.html', function(req, res) {
        res.render('music');
      })

      .get('/photography/displayimage.php', function(req, res) {

        var album = photoData[0];
        var vars = {
          album: album,
          position: req.query.position || 0
        };
        res.render('gallery', vars);
      })

      .get(['/photography.html', '/photography/', '/photography/thumbnails.php'], function(req, res) {

        var album = photoData[0];
        var vars = {
          album: album
        };
        res.render('thumbnails', vars);

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

      .get('/hashtagopenbook/displayimage.php', function(req, res) {
        var album = photoData[1];
        var vars = {
          album: album,
          position: req.query.position || 0
        };
        res.render('gallery', vars);
      })

      .get(['hashtagopenbook.html', '/hashtagopenbook/', '/hashtagopenbook/thumbnails.php'], function(req, res) {
        var album = photoData[1];
        var vars = {
          album: album
        };
        res.render('thumbnails', vars);
      })

      .get('/photography/nextthumb.php', function(req, res) {
        var album = req.param.album || 1;
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
        res.render('projects');
      })

      .get('/livingtopost.html', function(req, res) {
        res.render('livingtopost', {
          livingToPost: livingToPost
        });
      })

      .get('/promoslashindustry', function(req,res) {
        res.render('promoslashindustry');
      })

      .get('/testimonials.html', function(req, res) {
        res.render('testimonials');
      })

      .get('/watch/:id', function(req, res) {
        res.render('watch', {
          embedCode: filmDataFlat[req.params.id]
        })
      })

      .get('/workshopsandseminars.html', function(req, res) {
        res.render('workshopsandseminars');
      })

      .get('*', function(req, res) {
        res.status(404).render('404');
      });

    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
    });
  }
};
