// Create IE + others comaptible event handler
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

// Listen to message from child window
eventer(messageEvent, function(e) {
  var data = e.data.split('#');
  var layerId = data[0];
  var featureId = data[1];
  $('.layer-id').html(layerId);
  $('.feature-id').html(featureId);
}, false);
