import React from 'react';
import '../styles/Maps.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import $ from 'jquery';

mapboxgl.accessToken = 'pk.eyJ1IjoibWF0ZWptZWdsaWMiLCJhIjoiY2tiZXpudm1iMHFvZDJ1cG1ub3pqaHZhMyJ9.lzD5DdQCear_9OR586acJQ';
var lang; // = "slo"; //hardcoded value, change when in gatsby - HARDCODED CHANGE IF NEEDED
var routeCollection = []; // all routes from json
var hiddenRouteCollection = []; // all hidden routes from json
var iconsCollection = []; // all icons from json
var iconsShown = []; // array for all icons currently show on map
var langCollection = []; // all translations from json
var oneRouteCollection = []; // selected route
var limitedRouteCollection = []; // all routes - selected route
var combinedCoordinates = []; // for building a specific route from json route parts
var currentVisibleMapLayers = []; // keeping track of what layers are visible
var i = 0; // alternative naming set for map.setLayer
var peakShown = 0; // is peak shown
var charPosition; // for post pages and correct maps behaviour
var routeName; // for post pages route selection
var mapboxConfigObject; // object to refer to load mapboxConfig in based on window width
var mapboxConfig = [ // settings for map based on the device (screen width)


  {
    set: 'web',
    coordinates: [16.598508, 43.154552],
    zoom: 12.4,
    normalLineWidth: 6,
    limitedLineWidth: 4,
    selectedLineWidth: 10,
  },
  {
    set: 'mobile',
    coordinates: [16.593600, 43.162996],
    zoom: 11,
    normalLineWidth: 6,
    limitedLineWidth: 4,
    selectedLineWidth: 8,
  }
]
var baseLayers = [  // mapbox config for changing backgrounds
  {
  label: 'buttonOutdoors',
  id: 'outdoors-v11'
},
{
  label: 'buttonSatellite',
  id: 'satellite-v9' // alternatively use 'streets-v11'
}
];

// TO-DO PROBLEMS

var translation; // find another way to return a translation from a function getTranslation() - return doesn't work
// absolute path for panorama picture 
// double cleaning of forEach arrays (RemoveIcons() and currentVisibleLayer)
// show selected path on default for post page
// generate image gallery pages using gatsby


class Maps extends React.Component {

  constructor() {
    super();
    this.state = { stateRoute: "111" };
  }
 
  // read json doc
  getRoutes(){
    $.ajax({
      url:'/geojson_nikola.json', // source json doc in public folder
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
                'page': item.page,
                'parts': item.parts,
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
     
     // set array of icons [peak icon hardcoded]
     iconsCollection = data.icons;

     // set array of translations
     langCollection = data.languages;

    },
      error: function(xhr, status, err){
        console.log(err);
        alert(err);
      }
    });
    
  }
  


  componentDidMount() {

    var width = $(window).width(); // get screen width - need to be declared here due to SS rendering
    var sitePath = window.location.pathname; // get path

// functions declaration

  // define site language for map functionality (a bit hackish)
  function DefineSiteLanguage() {
    if (sitePath.length === 1){ // special handling for homepage, onChange modify layout.js as well
      lang = "slo";
    } 
    if (sitePath.substr(1, 3) === "slo") { // repeat for posts pages
      lang = "slo"
      charPosition = 5;
    }
    if (sitePath.substr(1, 2) === "en") { 
      lang = "en";
      charPosition = 4;
    } 
    if (sitePath.substr(1, 2) === "hr") {
      lang = "hr"
      charPosition = 4;
    }
  }

  // define a single route
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
      'line-width': mapboxConfigObject.normalLineWidth,
      'line-color': ['get', 'color'],
      'line-opacity': 1
      }
    });
    currentVisibleMapLayers.push(layerName); 
  }

  // get selected language
  function getTranslation(object) {
    langCollection.forEach(function(item){
      if (object === item.item) {
        translation = item.translation[lang];
      }
    });
  }

  // splice items from an array
  function removeFromArray(arrayName,comparisonValue) {
    for( var i = 0; i < arrayName.length; i++){        
      if ( arrayName[i] === comparisonValue) { 
        arrayName.splice(i, 1);
        i--;    
      }};   
  }

  // reset source and layer for route collection/single route
  function resetSource(sourceName, layerName) {  
    if (map.getLayer(layerName)) {
      map.removeLayer(layerName);
      removeFromArray(currentVisibleMapLayers,layerName);
    }
    if (map.getSource(sourceName)) {
       map.removeSource(sourceName);
    }
  }

  function mapSetPaintProperty() {
    // change opacity of all other routes
    //map.setPaintProperty('lines-layer', 'line-opacity', 0.3); // alternative with only opacity drop
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

  // reset colors (after alternative route color manipulation)
  function resetColor() {
    routeCollection.forEach(function (route){
      route.properties.color =  route.properties.originalColor;
    });
  }

  // on click on one of the routes
  function clickOnRoute() {
    currentVisibleMapLayers.forEach(function(layer){
      map.on('click', layer, function(e) {
        ShowSelectedRoute(e);
      });
    });
  }

  // pop-up on route hover + pointer handling
  function showPopUp(array) {
    array.forEach(function (item){
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
        }); 
      map.on('mouseenter', item, function(e) {
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
      map.on('mouseleave', item, function() {
      map.getCanvas().style.cursor = '';
      popup.remove();
      });
    });
  }

  // populate pop-up marker on peak [hardcoded]
  function PeakPopUp() {
    var peakCoordinates = [16.59839656400042,43.144040079941696];
    var el = document.createElement('div');
    el.id = 'marker';   
    new mapboxgl.Marker(el)
    .setLngLat(peakCoordinates)
    .addTo(map);  
    // show picture on click
    var marker = document.getElementById("marker").addEventListener('click', () => {
      var imgDiv = document.getElementById('peak');  
      if (peakShown === 0) {
          var showPeakImg = document.createElement('img');
          showPeakImg.src = 'https://raw.githubusercontent.com/matejmeglic/sveti-nikola/master/src/contents/misc/web_images/panorama.jpg'; // change to dynamic path that will work with main pages and with posts as well 
          showPeakImg.alt = "Sveti Nikola - 626m";
          showPeakImg.title = "Sveti Nikola - 626m";
          imgDiv.innerHTML = "";
          imgDiv.appendChild(showPeakImg);
          peakShown = 1;
        } else {
          imgDiv.innerHTML = "";
          peakShown = 0;
        }
      });   
      // hide picture on click
      document.getElementById("peak").addEventListener('click', () => {
        document.getElementById("peak").innerHTML = "";
      });
    }
   
  // populate pop-up warning (icons) markers based on json  
  function SetIcons(){
    iconsCollection.forEach(function(icon){
      var popupIcon = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        closeOnClick: false })
        .setHTML(
          icon.translation[lang]
        );  
        var el = document.createElement('div');
        el.className = 'elementIcon';   
        var marker = new mapboxgl.Marker(el)
        .setLngLat(icon.coordinates)
        .setPopup(popupIcon) 
        .addTo(map); 
        iconsShown.push(marker);  
    });
  }

  // remove all icons (used when hiddenRoute button is pressed for a clean map)
  function RemoveIcons(){
    iconsShown.forEach(function (marker){ 
      marker.remove();
      removeFromArray(iconsShown,marker);
    });
    iconsShown.forEach(function (marker){ // duplicated same shit not completely cleaning array
      marker.remove();
      removeFromArray(iconsShown,marker);
    });
  }

  // Show all routes
  function ShowAllRoutes(trigger) {
    resetColor();
    resetSource("lines","lines-layer");
    defineRoute('lines','lines-layer',routeCollection);
    var pathLength = sitePath.length;
    if (trigger !== undefined) {
      pathLength = trigger;
    }
    if ( pathLength > 5) {
      ShowSelectedRoute(); // posts page show only one route
    } else {
      clickOnRoute(); // general pages show all routes
    }
    showPopUp(currentVisibleMapLayers);
  };

  // extract post name from url
  function SliceURL() {
    
    if (charPosition === 4) {
      routeName = sitePath.slice(4);
      routeName = routeName.substring(0, routeName.length - 1);
    } else if (charPosition === 5) {
      routeName = sitePath.slice(5);
      routeName = routeName.substring(0, routeName.length - 1);
    }
  }

  // separate selected route from other routes from routeCollection
  function ExtractSelectedRoute(e) {
    oneRouteCollection = [];
    limitedRouteCollection = [];
    //split selected route from other route from collection
    if (e === undefined) { // for post pages
      SliceURL();
      routeCollection.forEach(function(item) { 
        if (routeName === item.properties.page) {
          oneRouteCollection.push(item);          
        } else {
          limitedRouteCollection.push(item);
        }   
      }); 
    } else { // on click route
      routeCollection.forEach(function(item) { 
        if (e.features[0].properties.route === item.properties.route) {
          oneRouteCollection.push(item);          
        } else {
          limitedRouteCollection.push(item);
        }   
      }); 
    }
  }

  // Show single (selected) route
  function ShowSelectedRoute(e) {
    resetColor();
    ExtractSelectedRoute(e);
    // remove alternative routes from collection (different styling)
    if (typeof oneRouteCollection[0].properties.alternative !== 'undefined') {
      oneRouteCollection[0].properties.alternative.forEach(function(alternativeRoute) {
        removeFromArray(limitedRouteCollection,alternativeRoute);
      });
    }
    // plot routes without selected route  
    resetSource("lines","lines-layer");
    defineRoute('lines','lines-layer',limitedRouteCollection);
    map.setPaintProperty('lines-layer','line-width', mapboxConfigObject.limitedLineWidth);
    mapSetPaintProperty()
    // reset previous alternative and hidden routes (so that currently selected route is on top)
    clearAlternatives(currentVisibleMapLayers,"alternativeRoute");
    setAlternatives(oneRouteCollection, routeCollection,"alternative","alternativeRoute",0.45);
    clearAlternatives(currentVisibleMapLayers,"hiddenRoute");
    setAlternatives(oneRouteCollection, hiddenRouteCollection,"hiddenRoute","hiddenRoute",0.75);
    // show selected route  
    resetSource("lines-one","lines-layer-one");
    defineRoute('lines-one','lines-layer-one',oneRouteCollection);
    map.setPaintProperty('lines-layer-one','line-width', mapboxConfigObject.selectedLineWidth);
    clickOnRoute();
    showPopUp(currentVisibleMapLayers);
    // update index.js
  };

  // clear alternative/hidden routes from map
  function clearAlternatives(array,stringName) {
      array.forEach(function(item){
        if (item.includes(stringName)) {
          resetSource(item, item)
          removeFromArray(array,item);
        }
      });       
    }
    
    // populate alternative/hidden routes on map
    function setAlternatives(oneRouteCollection,collection,prop,stringName, opacity) {
      if (typeof oneRouteCollection[0].properties[prop] !== 'undefined') {
        oneRouteCollection[0].properties[prop].forEach(function(alternativeRoute) {
        collection.forEach(function(route){
          if (route.properties.route === alternativeRoute) {
            route.properties.color = oneRouteCollection[0].properties.color;
            var oneAlternativeRoute = [];
            oneAlternativeRoute.push(route);
            i++;
            var iStr = stringName+i.toString();
            defineRoute(iStr, iStr, oneAlternativeRoute);
            map.setPaintProperty(iStr, 'line-opacity', opacity);
            map.on('click', iStr, function(e) {
              ShowSelectedRoute(e);
              }); 
            }
          });  
        });
      }
    }

    // actions
    // read json
    this.getRoutes();

    // set config options
    if (width > 700) {
      mapboxConfigObject = mapboxConfig[0]
    } else {
      mapboxConfigObject = mapboxConfig[1]
    }

    // plot map 16.587599,43.156592
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: mapboxConfigObject.coordinates,
      zoom: mapboxConfigObject.zoom
    });

    // get page language for map functionality
    DefineSiteLanguage();

    // load selected map
    map.on('style.load', function () {
      // Triggered when `setStyle` is called.
      if (routeCollection) ShowAllRoutes();
    });
    
   // build map navigation
    map.on('load', function() {
      // terrain buttons
      var menu = document.getElementById('menu');
      baseLayers.forEach(function(l) {
        var button = document.createElement('button'); 
        getTranslation(l.label);
        button.textContent = translation;
        button.addEventListener('click', function() {
          map.setStyle('mapbox://styles/mapbox/' + l.id);
        });
        menu.appendChild(button);
      });
      // reset route button
      if (width < 700) {
        var buttonName = "buttonAllRoutesShort";
      } else {
        var buttonName = "buttonAllRoutes";
      }
      var buttonResetRoutes = document.createElement('button');
      getTranslation(buttonName);
      buttonResetRoutes.textContent = translation;
      buttonResetRoutes.addEventListener('click',function() {
        SetIcons()
        ShowAllRoutes(1) // 1 triggers special behavior to show all routes on post page
        map.setPaintProperty('lines-layer','line-width', 6);
      });
      menu.appendChild(buttonResetRoutes);
      // delete route button on desktop only
      if (width < 700) {
        var buttonName = "buttonDeleteRouteShort";
      } else {
        var buttonName = "buttonDeleteRoute";
      }
      var buttonDeleteRoutes = document.createElement('button');
      getTranslation(buttonName);
      buttonDeleteRoutes.textContent = translation;
      buttonDeleteRoutes.addEventListener('click',function() {
        resetSource("lines","lines-layer");
        resetSource("lines-one","lines-layer-one");
        currentVisibleMapLayers.forEach(function(el){ //twice due to glith with forEach - gotta investigate
          resetSource(el,el);
        });
        currentVisibleMapLayers.forEach(function(el){
          resetSource(el,el);
        });
        RemoveIcons()
      });
      menu.appendChild(buttonDeleteRoutes);
  
      // enable geolocation tracking
      map.addControl(
        new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        trackUserLocation: true
        })
        );

    // enable scroll only if CTRL is held
    // map.scrollZoom.disable();
    // map.scrollZoom.setWheelZoomRate(0.02);
    // map.on("wheel", event => {
    //   if (event.originalEvent.ctrlKey) { 
    //     event.originalEvent.preventDefault(); 
    //     if (!map.scrollZoom._enabled) map.scrollZoom.enable(); 
    //   } else {
    //     if (map.scrollZoom._enabled) map.scrollZoom.disable(); 
    //   } 
    // });

 
         // on load config and populate screen with routes
         oneRouteCollection = [];
         ShowAllRoutes();
         PeakPopUp();
         SetIcons();
         if (sitePath.length > 5) { // posts page show only one route
           ShowSelectedRoute()
         }

     });

    

  







            

  } //componentdidmount



  render() {


    return (
      
      
      <div>
        <div id="map"></div>
        <nav id='menu' className='menu'></nav>
        <div id="peak"></div>
        <div id="scrollWarning"></div>
        <div id="hello-world"></div>
        


      </div>
      );
  }
}
export default Maps;