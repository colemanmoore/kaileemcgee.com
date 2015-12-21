$(document).ready(function() {

  var
    targetId = getParamValue("id"),
    codeToAdd,
    isMultiple = false;

  // Get video json info
  $.getJSON('/videodata', function(data) {

    data.forEach(function(section) {
      section.links.forEach(function(link) {
        var id = link.id;
        if (!!id && id===targetId) {

          var embed = link.embed;
          if (!!embed) {

            if (Array.isArray(embed)) {
              isMultiple = true;

              embed.forEach(function(item) {
                codeToAdd += item;
              });

            } else {
              codeToAdd = embed;
            }
          }
        }
      });
    });


    if (!!codeToAdd) {
      $('#watch-here').append(codeToAdd);
    }

    if (isMultiple) {
      $('#watch-here').addClass('multiple');
    }

  });

});

function getParamValue(param) {
  var pair, result = "";
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