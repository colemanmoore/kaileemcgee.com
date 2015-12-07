document.addEventListener("DOMContentLoaded", function(event) {
  todaysDate();
});

function todaysDate() {
  var week = ["Sunday","Monday","Tuesday","Wednesday","Thurday","Friday","Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  setInterval(updateTime, 1000);

  function updateTime() {
    time = new Date();
    var text = formatDate(time);
    var dateNode = document.getElementById("todays-date");
    while (dateNode.firstChild) {
      dateNode.removeChild(dateNode.firstChild);
    }
    dateNode.appendChild(text);
  }

  function formatDate(now) {
    return document.createTextNode("" +
      week[now.getDay()] + ", " +
      months[now.getMonth()] + " " + now.getDate() + " " +
      now.getFullYear() + " " +
      now.toLocaleTimeString());
  }
}