import React from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import $, { unique } from 'jquery';


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
var contentRoutes;

class App extends React.Component {

  getRoutes(){
    $.ajax({
      url:'/geojson_nikola.json',
      dataType:'json',
      cache: false,
      success: function(data){
       contentRoutes = data;
       console.log(contentRoutes.routes); // Pokaže array z dvema vnosoma (pravilno)
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
      container: this.mapWrapper,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [16.6149123,43.1390149],
      zoom: 12
    });

 
   // console.log(contentRoutes.routes); // vrne UNDEFINED (po mojem mnenju zato, ker ajax še ne naloži .json datoteke)


   // spodnjo kodo bi rad s .foreach pognal čez zgornji array, da za vsak vnos izvede funkcijo.
  map.on('load', function() {
  map.addSource(contentRoutes.routes[0].route, {
  'type': 'geojson',
  'data': {
  'type': 'Feature',
  'properties': {},
  'geometry': {
  'type': 'LineString',
  'coordinates': contentRoutes.routes[0].coordinates
  }
  }
  });
  map.addLayer({
  'id': contentRoutes.routes[0].route,
  'type': 'line',
  'source': contentRoutes.routes[0].route,
  'layout': {
  'line-join': 'round',
  'line-cap': 'round'
  },
  'paint': {
  'line-color': '#8ED081',
  'line-width': 8
  }
});
});
// konec kode, ki bi jo rad loop-al


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