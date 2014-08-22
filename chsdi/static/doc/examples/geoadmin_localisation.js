<!--//Create a GeoAdmin Map-->
var map = new ga.Map({

<!--// Define the div where the map is placed-->
  target: 'map',

<!--// Create a 2D view-->
  view: new ol.View2D({

<!--// 10 means that one pixel is 10m width and height-->
<!--// List of resolution of the WMTS layers:-->
<!--// 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1-->
    resolution: 5,

<!--// Define a coordinate CH1903 (EPSG:21781) for the center of the view-->
    center: [709136, 270186]
  })
});

<!--// Create a background layer-->
var lyr1 = ga.layer.create('ch.swisstopo.pixelkarte-farbe');

var iconFeature = new ol.Feature({
  geometry: new ol.geom.Point([709136, 270186]),
  name: 'Null Island',
  population: 4000,
  rainfall: 500
});

var iconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oLCAwhG8L1qXwAAAJ1SURBVDjLTZPBThRBEIa/6uleYtDVA8QHUGIw4ehVb3Ii+AK+guGid696Ud/AN4BAiFw9ePUAbmK4SIAo7OxuZtnZmZ7umfLQED1U0of6qur/q1oA9PgYWVlBBwNHCGt4v8Ws3GRa9BmPoSimDIc7jEYfqOtD+fw56MYGsruL6GCAPH6Mqjq+f9+jbZ9T1zArYVoo4zFMJsJoBMMh5PkBT55syNu3QZ89QwD07MxxcjJBZJEQFGME7+H8HC4vIc+5LqSMRsJsVuDcsnz7Fozu7zuOjvYoy0WKqeKccP8+3LkDvoHJJEVRwHQqVJVydXWXP392dXXVWcpyjbZ9DiggGIGmgdNTOPkFFxc3MMxmUJaCb5TQrBPCmmU43AKg64QQElhVMBrDZJzgsryBoaohBiFGEHllyfNNOoW2BV9DNU8G3gBlCfM51HWCQ4BOQQxo98Ly+3cfa5UQJCVVCZjP07uuUzQNhAhdB5kBI4qau5Y8hyxLlb3/B3gPtU9gDBDbZJPNQIRr2Viqaor3fWJMyU2T3G8aaGOS1ikYAZOBMSlAiLGwVNUOV1cvaVuIMU0S22uwTbvJDFgLCwsJjhFUQXXbEOMHQoC6VrxPBdr4H5wl8N49WFqC27eh11NcD5z7ZFjoHaJ6QIhCjErbpe4qSa+zcOsWLC4mCaqKdYK1X/D1YTrlN68de/s51byPqoIImUnde700Qa8HoIgIIRT8OFqWeRWMrq8j794HHj1YQuQA1XSNxkCWKSJK26YVqgqdfuHnz2WZV0EfPrz+TE+fIl+/oqurDu/XMGYLkU2c62MtwJQs28aYj1TVoQwGQVdWkONj/gL3ho+XUT2DTgAAAABJRU5ErkJggg=='
  })
});

iconFeature.setStyle(iconStyle);

var vectorSource = new ol.source.Vector({
  features: [iconFeature]
});

var vectorLayer = new ol.layer.Vector({
  source: vectorSource
});

<!--//Create an overlay layer-->
var element = $('<div class="element">' +
  '<div class="title"<h3>Kdo FU Waffenplätze</h3></div>' +
  '<div class="undertitle">' +
    '<br>Kaserne Auenfeld<br>' +
      '<div class="middle">' +
        '<br>8500 Frauenfeld<br>' +
      '</div>' +
  '</div>' +
  '<div class="close">' +
    '<div type="button" onclick="window.toggle()"<span aria-hidden="true">X</span></div>' +
  '</div>' +
'</div>' 
);

var popup = new ol.Overlay({
  position: map.getView().getCenter(),
  positioning:'centre-center',
  element: element,
});

function toggle() {
  element.toggle();
}

<!--// Add the layers in the map-->
map.addLayer(lyr1);
map.addLayer(vectorLayer);
map.addOverlay(popup);

