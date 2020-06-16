import React from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import $ from 'jquery';


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;


class App extends React.Component {

  getRoutes(){
    $.ajax({
      url:'/geojson_nikola.json',
      dataType:'json',
      cache: false,
      success: function(data){
        this.loadMap(data)
      },
      error: function(xhr, status, err){
        console.log(err);
        alert(err);
      }
    });
  }

  loadMap(data){
    const map = new mapboxgl.Map({
      container: this.mapWrapper,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [16.6149123,43.1390149],
      zoom: 12
    });

    map.on('load', function() {
    map.addSource(data[0].route, {
    'type': 'geojson',
    'data': {
    'type': 'Feature',
    'properties': {},
    'geometry': {
    'type': 'LineString',
    'coordinates': data[0].coordinates
    }
    }
    });
    map.addLayer({
    'id': data[0].route,
    'type': 'line',
    'source': data[0].route,
    'layout': {
    'line-join': 'round',
    'line-cap': 'round'
    },
    'paint': {
    'line-color': '#8ED081',
    'line-width': 4
    }
    });
    });
  
  }



  componentDidMount() {
  
    this.getRoutes();

  }


  
  render() {

    
   

    return (
      <div 
        ref={el => (this.mapWrapper = el)} 
        className="mapWrapper" 
      />
    );
  }
}
export default App;