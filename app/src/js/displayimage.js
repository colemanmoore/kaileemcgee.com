/*************************
  Coppermine Photo Gallery
  ************************
  Copyright (c) 2003-2014 Coppermine Dev Team
  v1.0 originally written by Gregory Demar

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License version 3
  as published by the Free Software Foundation.

  ********************************************
  Coppermine version: 1.5.38
  $HeadURL: https://svn.code.sf.net/p/coppermine/code/trunk/cpg1.5.x/js/displayimage.js $
  $Revision: 8800 $
**********************************************/

/**
 * This file contains displayimage.php specific javascript
 */
// When the document is ready

$(document).ready(function() {

  window.initializeGallery = function(js_vars) {

    var nextPosition    = parseInt(js_vars.position);
    var NumberOfPics    = parseInt(js_vars.count);
    var maxItems        = parseInt(js_vars.max_item);
    var width           = js_vars.thumb_width;
    var thumb_mode      = js_vars.thumb_use;
    var cat             = parseInt(js_vars.cat);

    /** The code below this is filmstrip specific **/
    var striptype = 'hori',
      leftimage = 'left.png',
      rightimage = 'right.png';

    // We need not execute the filmstrip js if there are not enough pictures in the album
    if(maxItems%2==0) {
      maxItems    = maxItems +1;
    }
    /**stop, if we don't have enough images than maxItem*/
    if(NumberOfPics <= maxItems) {
      return false;
    }

    //variables to handle the next - prev button
    var picQueue        = (maxItems+1)/2;
    var $go_next        = parseInt(maxItems/2);
    //cache the images RULs
    //create a objects to keep an array
    var url_cache       = new Array(NumberOfPics);
    var title_cache     = new Array(NumberOfPics);
    var img             = new Image();
    //checking position is zero and assign $go_next to zero
    var cacheIndex;
    if(nextPosition < picQueue) {
      cacheIndex      = 0;

    } else if(nextPosition > (NumberOfPics-picQueue)) {
      cacheIndex = NumberOfPics - maxItems;
      url_cache[0] = "";
    } else {
      cacheIndex = (nextPosition-$go_next);
      url_cache[0] = "";
    }

    // checking position is last thumb image
    for(var i=0; i<maxItems; i++) {
      url_cache[cacheIndex+i] = $("img.strip_image").eq(i).attr("src");
      title_cache[cacheIndex+i] = $("img.strip_image").eq(i).attr("title");
    }

    // button HTML
    $('td.prev_strip').html("<a id=\"filmstrip_prev\" rel=\"nofollow\" style=\"cursor: pointer;\"><img src=\"/images/gallery/icons/"+leftimage+"\" border=\"0\" /></a>");
    $('td.next_strip').html("<a id=\"filmstrip_next\" rel=\"nofollow\" style=\"cursor: pointer;\"><img src=\"/images/gallery/icons/"+rightimage+"\" border=\"0\" /></a>");

    // hide buttons if no further pics in direction
    if (nextPosition < (NumberOfPics - picQueue)) { $('#filmstrip_next').css( "visibility", "visible"); } else { $('#filmstrip_next').css( "visibility", "hidden"); }
    if (nextPosition > (picQueue-1)) { $('#filmstrip_prev').css( "visibility", "visible"); } else { $('#filmstrip_prev').css( "visibility", "hidden"); }

    //set position if it is not zero
    if(nextPosition < $go_next) {
      nextPosition    = $go_next;
    }

    //set postion if it is at end
    if(nextPosition > (NumberOfPics-picQueue)) {
      nextPosition    = (NumberOfPics-picQueue);
    }

    // set filmstrip height to thumb_width if thumb_use is not wd
    if (thumb_mode != 'wd' && striptype == 'hori') {
      stripheight = parseInt(width)+10;
      $('.tape').css("height", stripheight);
    }

    // Bind an onclick event on element with id filmstrip_next
    $('#filmstrip_next').click(function() {

      // check if animation is already in progress; if yes, do nothing
      if (typeof stripAniInProgress != 'undefined')
      { if (stripAniInProgress) return true; }

      // Get the url for next set of thumbnails. This will be the href of 'next' link;
      nextPosition = nextPosition +1;
      stripAniInProgress = 1;

      if(((NumberOfPics-1)-(picQueue-1)) <= nextPosition ) {
        $('#filmstrip_next').css( "visibility", "hidden");
      }
      //assign a variable to check initial position to next
      if(nextPosition < (picQueue-1)) {
        // nextPosition = picQueue-1;
      }

      if(nextPosition > (picQueue-1)) {
        $('#filmstrip_prev').css( "visibility", "visible"); // = "visible";
      }

      if (!url_cache[nextPosition + $go_next]) {
        if (!isNaN(cat)) {
          addCat = '&cat=' + cat;
        } else {
          addCat = "";
        }

        var next_url = "/photography/nextthumb.php?album=0&pos=" + nextPosition+addCat;
        // Send the ajax request for getting next set of filmstrip thumbnails
        $.getJSON(next_url, function(data) {

          url_cache[nextPosition+$go_next]  = data['url'];
          title_cache[nextPosition+$go_next] = data['title'];

          var itemLength = (striptype == 'hori') ? $(".tape tr > .thumb").length : $(".thumb").length;
          var itemsToRemove = maxItems+1;
          if (itemLength == itemsToRemove) {
            $('.remove').remove();
          }
          $('.tape').css("marginLeft", '0px');
          var url = "/photography/displayimage.php?position=" + nextPosition + "#top_display_media";
          var thumb = '<td align="center" class="thumb"><a style="width: '+width+'px; float: left" href="' + url + '"><img border="0" width="100px" title="' + data['title'] + '" alt="' + data['title'] + '" class="strip_image" src="' + data['url'] + '"/></a></td>';
          $('.tape tr').append(thumb);
          tempWidth = parseInt(width) +3;
          $('.tape').animate({
            marginLeft: "-"+tempWidth+"px"
          },250,"linear",function() {stripAniInProgress = 0;} );
          $('.thumb').eq(0).addClass("remove");
        });
      } else {
        var itemLength = $(".tape tr > .thumb").length;
        if (itemLength == (maxItems+1)) {
          $('.remove').remove();
        }
        $('.tape').css("marginLeft", '0px');
        var thumb = '<td align="center"  class="thumb" ><a style="width: '+width+'px; float: left" href="' + url_cache[nextPosition + $go_next] + '"><img border="0" width="100px" title="' + title_cache[nextPosition + $go_next] + '" alt="' + title_cache[nextPosition + $go_next] + '" class="strip_image" src="' + url_cache[nextPosition + $go_next] + '"/></a></td>';
        $('.tape tr').append(thumb);
        tempWidth = parseInt(width) +3;
        $('.tape').animate({
          marginLeft: "-"+tempWidth+"px"
        },250,"linear",function() {stripAniInProgress = 0;} );

        $('.thumb').eq(0).addClass("remove");
      }
    });


    // Bind a onclick event on element with id filmstrip_prev
    $('#filmstrip_prev').click(function() {

      // check if animation is already in progress; if yes, do nothing
      if (typeof stripAniInProgress != 'undefined')
      { if (stripAniInProgress) return true; }

      // Get the url for previous set of thumbnails. This will be the href of 'previous' link
      nextPosition = nextPosition -1;
      stripAniInProgress = 1;

      if(nextPosition >= ((NumberOfPics-1)-(picQueue-1))) {
        var nextPosition_to = (NumberOfPics-1)-(picQueue-1);
      } else {
        var nextPosition_to = nextPosition;
      }

      if(nextPosition_to <= (NumberOfPics-(picQueue))) {
        $('#filmstrip_next').css( "visibility", "visible"); //style.visibility = "visible"; // show();
      }

      if(nextPosition_to < (picQueue)) {
        $('#filmstrip_prev').css( "visibility", "hidden");  // hide();
      }

      if(!url_cache[nextPosition-$go_next]) {

        if (!isNaN(cat)) {
          addCat = '&cat=' + cat;
        } else {
          addCat = "";
        }

        var prev_url = "photography/gallery?film_strip=1&ajax_call=1&pos="+nextPosition+addCat;
        $.getJSON(prev_url, function(data) {
          url_cache[nextPosition-$go_next]  = data['url'];
          title_cache[nextPosition-$go_next] = data['title'];

          var itemLength = $(".tape tr> .thumb").length;
          if (itemLength == (maxItems+1)) {
            $('.remove').remove();
          }

          $('.tape').css("marginLeft", '-'+width+'px');
          var url = "/photography/displayimage.php?position=" + nextPosition + "#top_display_media";
          var thumb_prev = '<td align="center" class="thumb"><a style="width: '+width+'px; float: left" href="'+url+'"><img border="0" width="100px" title="' + data['title'] + '" alt="' + data['alt'] + '" class="strip_image" src="'+data['url']+'"/></a></td>';
          $('.tape tr').prepend(thumb_prev);

          $('.tape').animate({
            marginLeft: "0px"
          },250,"linear",function() {stripAniInProgress = 0;} );

          $('.thumb').eq((maxItems)).addClass("remove");
        });
      } else {
        var itemLength = $(".tape tr > .thumb").length;
        if (itemLength == (maxItems+1)) {
          $('.remove').remove();
        }

        $('.tape').css("marginLeft", '-'+width+'px');
        var thumb_prev = '<td align="center" class="thumb"><a style="width: '+width+'px; float: left" href="'+link_cache[nextPosition-$go_next]+'"><img border="0" width="100px" title="' + title_cache[nextPosition-$go_next] + '" alt="' + alt_cache[nextPosition-$go_next] + '" class="strip_image" src="'+url_cache[nextPosition-$go_next]+'"/></a></td>';
        $('.tape tr').prepend(thumb_prev);

        $('.tape').animate({
          marginLeft: "0px"
        },250,"linear",function() {stripAniInProgress = 0;} );

        $('.thumb').eq(maxItems).addClass("remove");
      }

    });
  }

});
