import React from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import $ from 'jquery';


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
var routeCollection = [];
var oneRouteCollection = [];

var baseLayers = [ 
  {
  label: 'Outdoors',
  id: 'outdoors-v11'
},
{
  label: 'Satellite',
  id: 'satellite-v9'
}
];

class App extends React.Component {

  getRoutes(){
    $.ajax({
      url:'/geojson_nikola2.json',
      dataType:'json',
      cache: false,
      success: function(json){
        var data = json;
        var i = 0; // for colors

        data.routes.forEach(function(item) {
             // set array of mapbox line objects                   
             
             routeCollection.push(
              {
                'type': 'Feature',
                'properties': {
                'color': data.colors[i],
                'route': item.route
                },
                'geometry': {
                'type': 'LineString',
                'coordinates': item.coordinates
                }
                }
             );
            i++;
            
        });
         
      },
      error: function(xhr, status, err){
        console.log(err);
        alert(err);
      }
    });

    
  }

   

  componentDidMount() {

    // read json
    this.getRoutes();

    // show map
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [16.587599,43.156592],
      zoom: 13
    });
    // 'mapbox://styles/mapbox/satellite-v9'

   // build all routes
    map.on('load', function() {
      // cleanup

      // map.addSource('lines', {
      // 'type': 'geojson',
      // 'data': {
      // 'type': 'FeatureCollection',
      // 'features': routeCollection
      // }
      // });
      // map.addLayer({
      // 'id': 'lines-layer',
      // 'type': 'line',
      // 'source': 'lines',
      // 'paint': {
      // 'line-width': 6,
      // 'line-color': ['get', 'color'],
      // 'line-opacity': 1
      // }
      // });

      

      baseLayers.forEach(function(l) {
        var button = document.createElement('button'); 
        button.textContent = l.label;
        button.addEventListener('click', function() {
          map.setStyle('mapbox://styles/mapbox/' + l.id); 
        });
    
        menu.appendChild(button);

      });
      });



      // set marker on top
      var marker = new mapboxgl.Marker()
      .setLngLat([16.59839656400042,43.144040079941696])
      .addTo(map);

      // pop-up on click
      // When a click event occurs on a feature in the states layer, open a popup at the
        // location of the click, with description HTML from its properties.
         map.on('click', 'lines-layer', function(e) {
        //   new mapboxgl.Popup()
        //   .setLngLat(e.lngLat)
        //   .setHTML(e.features[0].properties.route)
        //   .addTo(map);
          
          // remember selected route
          oneRouteCollection = [];
          routeCollection.forEach(function(item) {
            
            if (e.features[0].properties.route === item.properties.route) {
              oneRouteCollection.push(item);
            }
          
          });

          // re-color all routes
        //   if (map.getLayer("lines-layer")) {
        //     map.removeLayer('lines-layer');
        // }

        //   if (map.getSource("lines")) {
        //     map.removeSource('lines');
        // }

        //     map.addSource('lines', {
        //     'type': 'geojson',
        //     'data': {
        //     'type': 'FeatureCollection',
        //     'features': routeCollection
        //     }
        //     });
        //     map.addLayer({
        //     'id': 'lines-layer',
        //     'type': 'line',
        //     'source': 'lines',
        //     'paint': {
        //     'line-width': 6,
        //     'line-color': '#bababa'
        //     }
        //     });

     map.setPaintProperty('lines-layer', 'line-opacity', 0.2);
     

            // expose selected route
          if (map.getLayer("lines-layer-one")) {
            map.removeLayer('lines-layer-one');
        }

          if (map.getSource("lines-one")) {
            map.removeSource('lines-one');
        }

            map.addSource('lines-one', {
            'type': 'geojson',
            'data': {
            'type': 'FeatureCollection',
            'features': oneRouteCollection
            }
            });
            map.addLayer({
            'id': 'lines-layer-one',
            'type': 'line',
            'source': 'lines-one',
            'paint': {
            'line-width': 6,
            'line-color': ['get', 'color'],
            'line-opacity': 1
            }
            });

        
        });
          



          // Change the cursor to a pointer when the mouse is over the states layer.
          map.on('mouseenter', 'lines-layer', function() {
          map.getCanvas().style.cursor = 'pointer';
          });
          
          // Change it back to a pointer when it leaves.
          map.on('mouseleave', 'lines-layer', function() {
          map.getCanvas().style.cursor = '';
          });

        // pop-up on hover
        // Create a popup, but don't add it to the map yet.
        var popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
          });
          
          map.on('mouseenter', 'lines-layer', function(e) {
          // Change the cursor style as a UI indicator.
          map.getCanvas().style.cursor = 'pointer';
          
          var coordinates = e.features[0].geometry.coordinates.slice();
                    
          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          
          // Populate the popup and set its coordinates
          // based on the feature found.
          popup
          .setLngLat(e.lngLat)
          .setHTML(e.features[0].properties.route)
          .addTo(map);
          });
          
          map.on('mouseleave', 'lines-layer', function() {
          map.getCanvas().style.cursor = '';
          popup.remove();
          });

// layers
var menu = document.getElementById('menu');


function addDataLayer() {

  if (map.getLayer("lines-layer")) {
    map.removeLayer('lines-layer');
}

  if (map.getSource("lines")) {
    map.removeSource('lines');
}

    map.addSource('lines', {
    'type': 'geojson',
    'data': {
    'type': 'FeatureCollection',
    'features': routeCollection
    }
    });
    map.addLayer({
    'id': 'lines-layer',
    'type': 'line',
    'source': 'lines',
    'paint': {
    'line-width': 6,
    'line-color': ['get', 'color'],
    'line-opacity': 1
    }
    });

  };

  map.on('style.load', function () {
    // Triggered when `setStyle` is called.
    if (routeCollection) addDataLayer();
  });


  } //componentdidmount



  render() {


    return (
      
      
      <div>
        <div id="map"></div>
        <nav id='menu' className='menu'></nav>


      </div>
      );
  }
}
export default App;