document.addEventListener("DOMContentLoaded", function() {
  visitorCount();
});

function visitorCount() {
  var
    dayOne = new Date(2016, 1, 1),
    dayOneCount = 1421,
    now = new Date();

  // 2 views per hour
  var count = (((now.getTime() / 1000 / 60 / 60) - (dayOne.getTime() / 1000 / 60 / 60)) * 2) + dayOneCount;

  var countNode = document.getElementById("visitor-counter");
  countNode.appendChild(document.createTextNode("Visitors: " + Math.round(count)));
}