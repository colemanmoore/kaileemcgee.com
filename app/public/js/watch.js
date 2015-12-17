$(document).ready(function() {

  var targetId = getParamValue("id");
  var embedCode;

  // Get video json info
  $.getJSON('/videodata', function(data) {

    data.forEach(function(section) {
      section.links.forEach(function(link) {
        var id = link.id;
        var embed = link.embed;

        // Map the embed code to its id for the watch page
        if (!!id && !!embed) {
          if (id===targetId) {
            embedCode = embed;
          }
        }
      });
    });

    if (!!embedCode) {
      $('#watch-here').append(embedCode);
    }

  });

});

function getParamValue(param) {
  var vars = [], pair, result = "";
  var q = document.URL.split('?')[1];
  if(q != undefined){
    q = q.split('&');
    for(var i = 0; i < q.length; i++){
      pair = q[i].split('=');
      if (pair[0]===param) {
        result = pair[1];
        break;
      }
    }
  }
  return result;
}