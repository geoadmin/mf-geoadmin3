<html>
  <head>
   <script src="//api3.geo.admin.ch/loader.js?lang=en" type="text/javascript"></script>
   <style>
      body {
        margin: 0 auto;
        position: absolute;
        top: 0;
        font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
      }
      
      #header {
        margin-top: 0;
        margin-left:40px;
        height: 150px;
        position: relative;
        max-width: 1670px;
        min-width: 1000px;
        background-color: rgba(200,200,200,1);
        padding: 5px 10px 10px 10px;
        text-align: center;
        border-bottom: 4px solid red;
      }

      #header h2 {
       font-weight: normal;
      }
      
      #link {
        font-weight: bold;
      }
      
      #link p {
        display: inline-block;
        padding-left: 10px;
        margin: 0;
      }
  
      #content {
        max-width: 1800px;
        width: 100%;
        margin-right: 0;
        float: left;
        min-height: 1200px;
        margin-top: 40px;
        margin-left: 40px;
      }

       .map {
        height: 400px;
        width: 100%;
      }

      #api:first-child {
        background-color: #E3F6CE;
      }
      
      #api:first-child::after {
        content: 'Last created';
        color: #01DF01;
        font-weight: bold;
        display: inline-block;
        margin: 5px 0 5px 10px; 
      }

      #api {
        float: left;
        height: 465;
        width: 550;
        margin: 0 10px 20px 0;
      }
    </style>
  </head>
  <body>
<%
files = pageargs['files']
bucket = pageargs['bucket']
host = pageargs['host']
%>
    <div id="header">
      <h1>Administration for kml storage</h1>
      <h2><i>Displaying of the last 50 files created - Number of kml file: ${count}</i></h2>
    </div>

    <div id="content">
% for idx, file in enumerate(files):
      <div id="api">
        <div id="map-${idx}" class="map"></div><br>
        <div id="link"><p><a target="_blank" href='https://${host}/?X=182898.59&Y=662367.14&zoom=0&lang=fr&topic=ech&bgLayer=ch.swisstopo.pixelkarte-farbe&layers=&adminId=${file[1]}'>Edit link on map.geo.admin.ch</a></p><p>Created on : ${file[2]}</p></div>
      </div>

  <script type="text/javascript">
      var layer = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
 
      var source${idx} = new ol.source.Vector({
          url: '//${bucket}/files/${file[0]}',
          format : new ol.format.KML({
            projection: 'EPSG:21781'
          })
      });

      var vector${idx} = new ol.layer.Vector({
        source: source${idx}
      });

      var map${idx} = new ga.Map({
        target: 'map-${idx}',
        layers: [layer],
        view: new ol.View({
        })
      });
    
      source${idx}.on('change', function(event) {
  
        var extent = source${idx}.getExtent();
        map${idx}.getView().fitExtent(extent, map${idx}.getSize());
      }); 
 
      map${idx}.addLayer(vector${idx});
  </script>

%endfor

    </div> 
  </body>
</html>
