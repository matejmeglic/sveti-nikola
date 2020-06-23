import React from 'react';
import './Maps.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import $ from 'jquery';


mapboxgl.accessToken = 'pk.eyJ1IjoibWF0ZWptZWdsaWMiLCJhIjoiY2tiZXpudm1iMHFvZDJ1cG1ub3pqaHZhMyJ9.lzD5DdQCear_9OR586acJQ';
var routeCollection = []; // all routes from json
var hiddenRouteCollection = []; // all hidden routes from json
var oneRouteCollection = []; // selected route
var limitedRouteCollection = []; // all routes - selected route
var combinedCoordinates = []; // for building a specific route from json route parts
var layers = []; // keeping track of what layers are visible
var i = 0; // alternative naming set for map.setLayer

var baseLayers = [ 
  {
  label: 'Outdoors',
  id: 'outdoors-v11'
},
{
  label: 'Satellite',
  id: 'satellite-v9' // 'streets-v11'
}
];

class Maps extends React.Component {

 
  // read json doc
  getRoutes(){
    $.ajax({
      url:'/geojson_nikola3.json', // source json doc in public folder
      dataType:'json',
      cache: false,
      success: function(json){
        var data = json;
        // set up array for visible routes
        data.routes.forEach(function(item) {
             combinedCoordinates = []; // empty array for each route
             item.parts.forEach(function(part) {
               data.routeParts.forEach(function(routePart) {
                if (routePart.route === part) {
                  routePart.coordinates.map(x => combinedCoordinates.push(x));               
                }
              });
             });
          
          // set array of mapbox line objects                   
             routeCollection.push(
              {
                'type': 'Feature',
                'properties': {
                'color': item.color,
                'originalColor': item.color,
                'route': item.route,
                'alternative': item.alternative,
                'hiddenRoute': item.hiddenRoute
                
                },
                'geometry': {
                'type': 'LineString',
                'coordinates': combinedCoordinates
                }
                }
             );
            

        });  

        
        // set up array for hidden routes
        data.hidden_routes.forEach(function(item) {
          combinedCoordinates = []; // empty array for each route
          item.parts.forEach(function(part) {
            data.routeParts.forEach(function(routePart) {
             if (routePart.route === part) {
               routePart.coordinates.map(x => combinedCoordinates.push(x));               
             }
           });
          });
       
       // set array of mapbox line objects                   
          hiddenRouteCollection.push(
           {
             'type': 'Feature',
             'properties': {
             'color': item.color,
             'originalColor': item.color,
             'route': item.route,
             'alternative': item.alternative
             
             },
             'geometry': {
             'type': 'LineString',
             'coordinates': combinedCoordinates
             }
             }
          );
         

     }); 
      },
      error: function(xhr, status, err){
        console.log(err);
        alert(err);
      }
    });
    
  }
  


  componentDidMount() {

// functions declaration

  // function define a single route
  function defineRoute(sourceName, layerName, features) {
    map.addSource(sourceName, {
      'type': 'geojson',
      'data': {
      'type': 'FeatureCollection',
      'features': features
      }
    });
    map.addLayer({
      'id': layerName,
      'type': 'line',
      'source': sourceName,
      'paint': {
      'line-width': 6,
      'line-color': ['get', 'color'],
      'line-opacity': 1
      }
    });
    layers.push(layerName);
    
  }

  function removeFromArray(arrayName,comparisonValue) {
    for( var i = 0; i < arrayName.length; i++){ 
           
      if ( arrayName[i] === comparisonValue) { 
        arrayName.splice(i, 1);
        i--; 
        
      }};
      
  }

  // function reset source and layer
  
  function resetSource(sourceName, layerName) {
    
    if (map.getLayer(layerName)) {
      map.removeLayer(layerName);

      removeFromArray(layers,layerName);
    }
    if (map.getSource(sourceName)) {
       map.removeSource(sourceName);
    }
  }

  // reset colors (after alternative route color manipulation)
  function resetColor() {
    routeCollection.forEach(function (route){
      route.properties.color =  route.properties.originalColor;
    });
  }

// Show all routes
function showAllRoutes() {
  

  resetColor();
  resetSource("lines","lines-layer");
  defineRoute('lines','lines-layer',routeCollection);
  clickOnRoute();
};

  // Show single (selected) route
  function showSelectedRoute(e) {
    // remember selected route
    resetColor();
    oneRouteCollection = [];
    limitedRouteCollection = [];
        routeCollection.forEach(function(item) { 
        
        if (e.features[0].properties.route === item.properties.route) {
          oneRouteCollection.push(item);          
        } else {
          limitedRouteCollection.push(item);
        }   
      });
      

      if (typeof oneRouteCollection[0].properties.alternative !== 'undefined') {
        oneRouteCollection[0].properties.alternative.forEach(function(alternativeRoute) {
          
          removeFromArray(limitedRouteCollection,alternativeRoute);
          

        });
      }
      
      resetSource("lines","lines-layer");
      defineRoute('lines','lines-layer',limitedRouteCollection);
      mapSetPaintProperty()
      // reset previous Alternative routes (so that currently selected route is on top)
    clearAlternatives();
    setAlternatives(oneRouteCollection);
    clearHiddenRoutes();
    setHiddenRoutes(oneRouteCollection);
    // show selected route  
    resetSource("lines-one","lines-layer-one");
    defineRoute('lines-one','lines-layer-one',oneRouteCollection);
    map.setPaintProperty('lines-layer-one','line-width', 10);
    map.setPaintProperty('lines-layer','line-width', 4);
    clickOnRoute();
    
  };

  function mapSetPaintProperty() {
    // change opacity of all other routes
    //map.setPaintProperty('lines-layer', 'line-opacity', 0.3);
    var nonSelectedRouteColor;
    var mapStyle = map.getStyle();
    if (mapStyle.name === "Mapbox Outdoors") {
      nonSelectedRouteColor = '#737373';
    } else if (mapStyle.name === "Mapbox Satellite") {
      nonSelectedRouteColor = '#a1a1a1';
    } else {
      console.log("Check mapStyle - Not Outdoors or Satellite map selected.");
    }
     map.setPaintProperty('lines-layer', 'line-color', nonSelectedRouteColor);
  }

  //
  function clearHiddenRoutes() {


    layers.forEach(function(layer){
      if (layer.includes("hiddenRoute")) {
        resetSource(layer, layer)
        removeFromArray(layers,layer);
      }
    }); 

    
  }
  
  //
  function setHiddenRoutes(oneRouteCollection) {
    if (typeof oneRouteCollection[0].properties.hiddenRoute !== 'undefined') {
      
      
      oneRouteCollection[0].properties.hiddenRoute.forEach(function(hiddenRoute) {
       
      hiddenRouteCollection.forEach(function(route){
        if (route.properties.route === hiddenRoute) {
          route.properties.color = oneRouteCollection[0].properties.color;
          var oneHiddenRoute = [];
          oneHiddenRoute.push(route);
          i++;
          
          
          var iStr = "hiddenRoute"+i.toString();
          

          defineRoute(iStr, iStr, oneHiddenRoute);
          map.setPaintProperty(iStr, 'line-opacity', 0.75);
          // map.on('click', iStr, function(e) {
          //   showSelectedRoute(e);
          // });
          
        }
      });
      
    });
  }
  }

  //
  function clearAlternatives() {


      layers.forEach(function(layer){
        if (layer.includes("alternativeRoute")) {
          resetSource(layer, layer)
          removeFromArray(layers,layer);
        }
      }); 

      
    }
    
    //
    function setAlternatives(oneRouteCollection) {
      if (typeof oneRouteCollection[0].properties.alternative !== 'undefined') {
        
        
        oneRouteCollection[0].properties.alternative.forEach(function(alternativeRoute) {
         
        routeCollection.forEach(function(route){
          if (route.properties.route === alternativeRoute) {
            route.properties.color = oneRouteCollection[0].properties.color;
            var oneAlternativeRoute = [];
            oneAlternativeRoute.push(route);
            i++;
            
            
            var iStr = "alternativeRoute"+i.toString();
            

            defineRoute(iStr, iStr, oneAlternativeRoute);
            map.setPaintProperty(iStr, 'line-opacity', 0.45);
            map.on('click', iStr, function(e) {
              showSelectedRoute(e);
            });
            
          }
        });
        
      });
    }
    }

      // on click on one of the routes
      function clickOnRoute() {
        layers.forEach(function(layer){
          map.on('click', layer, function(e) {
            showSelectedRoute(e);
          });
    
        });
      }
 

    // pop-up on route hover + pointer handling
    function showPopUp() {
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
        }); 

        map.on('mouseenter', 'lines-layer', function(e) {
        map.getCanvas().style.cursor = 'pointer';
        
        var coordinates = e.features[0].geometry.coordinates.slice();
                  
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        popup
        .setLngLat(e.lngLat)
        .setHTML(e.features[0].properties.route)
        .addTo(map);
        });
        
        map.on('mouseleave', 'lines-layer', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
        });

    }

    // actions
    // read json
    this.getRoutes();

    // plot map
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [16.587599,43.156592],
      zoom: 13
    });

    
    

    // load selected map
    map.on('style.load', function () {
      // Triggered when `setStyle` is called.
      if (routeCollection) showAllRoutes();
    });
    
   // build map navigation
    map.on('load', function() {
      // terrain buttons
      var menu = document.getElementById('menu');
      baseLayers.forEach(function(l) {
        var button = document.createElement('button'); 
        button.textContent = l.label;
        button.addEventListener('click', function() {
          map.setStyle('mapbox://styles/mapbox/' + l.id);
        });
        menu.appendChild(button);
      });
      // reset route button
      var buttonResetRoutes = document.createElement('button');
      buttonResetRoutes.textContent = "All Routes";
      buttonResetRoutes.addEventListener('click',function() {
        showAllRoutes()
      });
      menu.appendChild(buttonResetRoutes);
      oneRouteCollection = [];
    });

  

        // // Change the cursor to a pointer when the mouse is over the states layer.
        // map.on('mouseenter', 'lines-layer', function() {
        //   map.getCanvas().style.cursor = 'pointer';
        //   });
        // map.on('mouseenter', 'lines-layer-one', function() {
        //   map.getCanvas().style.cursor = 'pointer';
        //   });
          
        // // Change it back to a pointer when it leaves.
        // map.on('mouseleave', 'lines-layer', function() {
        //   map.getCanvas().style.cursor = '';
        //   });
        // map.on('mouseleave', 'lines-layer-one', function() {
        //   map.getCanvas().style.cursor = '';
        //   });
        	
          showPopUp();




          // pop up on peak
          var peakCoordinates = [16.59839656400042,43.144040079941696];
          var popupPeak = new mapboxgl.Popup({ 
            offset: 25,
            closeButton: false,
            closeOnClick: false })
            .setText(
              'Sveti Nikola - 626m'
            );
             
            var el = document.createElement('div');
            el.id = 'marker';
             
            
            new mapboxgl.Marker(el)
            .setLngLat(peakCoordinates)
            .setPopup(popupPeak) 
            .addTo(map);


            showAllRoutes();

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
export default Maps;