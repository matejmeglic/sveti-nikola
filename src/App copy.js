import React from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import $ from 'jquery';


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
var data;

class App extends React.Component {

  getRoutes(){
    $.ajax({
      url:'/geojson_nikola.json',
      dataType:'json',
      cache: false,
      success: function(data1){
        data = data1;

      },
      error: function(xhr, status, err){
        console.log(err);
        alert(err);
      }
    });
  }

  componentDidMount() {
  
    this.getRoutes();

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [16.6149123,43.1390149],
      zoom: 12
    });

    
    // map.on('load', function() {
    //   map.addSource(data.routes[0].route, {
    //   'type': 'geojson',
    //   'data': {
    //   'type': 'Feature',
    //   'properties': {},
    //   'geometry': {
    //   'type': 'LineString',
    //   'coordinates': data.routes[0].coordinates
    //   }
    //   }
    //   });
    //   map.addLayer({
    //   'id': data.routes[0].route,
    //   'type': 'line',
    //   'source': data.routes[0].route,
    //   'layout': {
    //   'line-join': 'round',
    //   'line-cap': 'round'
    //   },
    //   'paint': {
    //   'line-color': data.colors[0],
    //   'line-width': 4
    //   }
    //   });
    //   });

    // map.on('load', function() {
    // map.addSource(data.routes[1].route, {
    // 'type': 'geojson',
    // 'data': {
    // 'type': 'Feature',
    // 'properties': {},
    // 'geometry': {
    // 'type': 'LineString',
    // 'coordinates': data.routes[1].coordinates
    // }
    // }
    // });
    // map.addLayer({
    // 'id': data.routes[1].route,
    // 'type': 'line',
    // 'source': data.routes[1].route,
    // 'layout': {
    // 'line-join': 'round',
    // 'line-cap': 'round'
    // },
    // 'paint': {
    // 'line-color': data.colors[1],
    // 'line-width': 4
    // }
    // });
    // });

   
    // map.on('load', function() {
    // map.addSource(data.routes[2].route, {
    // 'type': 'geojson',
    // 'data': {
    // 'type': 'Feature',
    // 'properties': {},
    // 'geometry': {
    // 'type': 'LineString',
    // 'coordinates': data.routes[2].coordinates
    // }
    // }
    // });
    // map.addLayer({
    // 'id': data.routes[2].route,
    // 'type': 'line',
    // 'source': data.routes[2].route,
    // 'layout': {
    // 'line-join': 'round',
    // 'line-cap': 'round'
    // },
    // 'paint': {
    // 'line-color': data.colors[2],
    // 'line-width': 4
    // }
    // });
    // });

    // map.on('load', function() {
    //   map.addSource(data.routes[3].route, {
    //   'type': 'geojson',
    //   'data': {
    //   'type': 'Feature',
    //   'properties': {},
    //   'geometry': {
    //   'type': 'LineString',
    //   'coordinates': data.routes[3].coordinates
    //   }
    //   }
    //   });
    //   map.addLayer({
    //   'id': data.routes[3].route,
    //   'type': 'line',
    //   'source': data.routes[3].route,
    //   'layout': {
    //   'line-join': 'round',
    //   'line-cap': 'round'
    //   },
    //   'paint': {
    //   'line-color': data.colors[3],
    //   'line-width': 4
    //   }
    //   });
    //   });

    //   map.on('load', function() {
    //     map.addSource(data.routes[4].route, {
    //     'type': 'geojson',
    //     'data': {
    //     'type': 'Feature',
    //     'properties': {},
    //     'geometry': {
    //     'type': 'LineString',
    //     'coordinates': data.routes[4].coordinates
    //     }
    //     }
    //     });
    //     map.addLayer({
    //     'id': data.routes[4].route,
    //     'type': 'line',
    //     'source': data.routes[4].route,
    //     'layout': {
    //     'line-join': 'round',
    //     'line-cap': 'round'
    //     },
    //     'paint': {
    //     'line-color': data.colors[4],
    //     'line-width': 4
    //     }
    //     });
    //     });

    //     map.on('load', function() {
    //       map.addSource(data.routes[5].route, {
    //       'type': 'geojson',
    //       'data': {
    //       'type': 'Feature',
    //       'properties': {},
    //       'geometry': {
    //       'type': 'LineString',
    //       'coordinates': data.routes[5].coordinates
    //       }
    //       }
    //       });
    //       map.addLayer({
    //       'id': data.routes[5].route,
    //       'type': 'line',
    //       'source': data.routes[5].route,
    //       'layout': {
    //       'line-join': 'round',
    //       'line-cap': 'round'
    //       },
    //       'paint': {
    //       'line-color': data.colors[5],
    //       'line-width': 4
    //       }
    //       });
    //       });

          var marker = new mapboxgl.Marker()
          .setLngLat([16.59839656400042,43.144040079941696])
          .addTo(map);

          map.on('load', function() {
          map.addSource('state', {
          'type': 'geojson',
          'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': [{
          'type': 'LineString',
          'coordinates': data.routes[5].coordinates
          },
             {

            'type': 'LineString',
            'coordinates': data.routes[4].coordinates

          }]
        
        }
        });
          map.addLayer({
          'id': 'state',
          'type': 'line',
          'source': 'state',
          'layout': {
          'line-join': 'round',
          'line-cap': 'round'
          },
          'paint': {
          'line-color': data.colors[5],
          'line-width': 4
          }
          });
          });
        



  } //componentdidmount



  render() {

    
   

    return (
      <div id="map"></div>
    );
  }
}
export default App;