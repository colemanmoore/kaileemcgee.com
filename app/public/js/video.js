$(document).ready(function() {
  var domRoot = document.getElementById('video-listing-section');
  var videoEmbedById = {};

  // Get video json info
  $.getJSON('/videodata', function(data) {

    data.forEach(function(section, sectionIndex) {

      var header = section.sectionHeader;
      $(domRoot).append('<div class="video-section-header"><h2>' + header + '</h2></div>');

      var videoSectionList = document.createElement('div');
      $(videoSectionList).addClass('video-section-list');
      var list = document.createElement('ul');

      // Add each link to the list list
      section.links.forEach(function(link, linkIndex) {
        var id = link.id;
        var text = link.text;
        var embed = link.embed;

        // Map the embed code to its id for the watch page
        if (!!id && !!embed) {
          videoEmbedById[id] = embed;
          var href = "/watch?id=" + id;
        }

        // Or just link to the video online
        else if (!!link.lives) {
          href = link.lives;
        }

        // Add link to the filmandvideo page
        if (!!text && !!href) {
          $(list).append('<li><a target="_blank" href=' + href + '>'+ text +'</a></li>');
        }

      });

      $(videoSectionList).append(list);
      $(domRoot).append(videoSectionList);

    });

    var id = getParameterByName("id");
    if (!!id) {
      console.log(id);
    }

  });

});


