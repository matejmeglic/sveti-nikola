This is a project that describes all ascents to Saint Nikola peak - Island Hvar (Croatia).

# General
- gatsby reads all md files *(route descriptions in 3 languages HR, EN and SLO)* and generates static pages
- read json file in public folder to get all routes and translations
- md files contain all images in a sequence *(not optimal, should be auto generated as folder structure that represents route_parts is in place, but couldn't do it easily with react - would require NodeJS implementation)*
- main logic is spread in **components/Maps.js**, refer to comments for documentation
- components/RouteColor.js extracts color from json for visual separation of the routes
- language selection work based on url (pathname) that depends on md file structure (i created separate folders for different languages AND lang frontmatter property that is also used in blog-post.js)
- geojson gets loaded during build-time which is preferred way so that we can use translations on all pages (instead of previously used jquery in the component)
- get **mapbox gl **api key to show maps and limit it to your domain

# GeoJson file
### Extract coordinates from google maps
- run gMaps_Path_Extractor.html locally *(get google maps api key)* to extract coordinates manually from google maps: store coordinates only in route_parts section

### routeParts
- currently, I implemented route_parts that are parts of the route that get duplicated to avoid having messy maps and for reusability *(also for potential NodeJS image gallery automation purposes where pictures could be generated)*

### routes
- from route_parts, routes are built *(legacy full routes are still in json but not used)*
- alternative routes: are routes that enably user to walk different path *(alternative routes are normal routes in route section, copy route name)*
- hidden routes: are routes where user can return to starting point, but are not visible on main map and cannot be clicked *(usually return on public road, hidden routes have separate array in geojson)*
- note that order of routes matter. the lower the route is, more on top it will appear (some routes could never be picked or are less important)
- in page, make sure to have whole string like url will look like *(use - instead of spaces and avoid weird simbols such as čšž)*
- choose appropriate route color

### hidden_routes
- are simplified **routes** with dedicated color #333 that are hidden from the main map

### icons
- these are warning simbols that are populated on a specific coordinates and enable you to show warning of any kind (html)

### languages
- are translations for all page content
- item: "BLANK" is an object placeholder for easily adding translations as there is no static text on the page

### routes-full-legacy
- is not used, is a reminder of an old approach where I coded whole parts in the same route (simplified, but not suitable for automatic picture generation and other features)

## Other important settings
### components/Maps.js
- **mapboxConfig object** defines starting point for maps on web and mobile devices with zoom and route line stroke intensity
- **baseLayers object** defines which mapbox map options are available (satellite, outdoors, streets etc.)
- in **mapSetPaintProperty()** function, you can define colors for not-selected routes for each map option 
- if you are adding functionality in geoJson, don't forget to add it into your data source **routeCollection** or other subsources in g**etRoutes()** function
- if you want to change default language, you have to change:
    - src/pages index.html and other static pages names AND GraphQL queries
    - change **DefineSiteLanguage()** function in components/Maps.js
- **PeakPopUp()** is showing middle picture and opens a panorama on click (**hardcoded coordinates** in components/Maps.js and in **css id="marker"**)
- disabling auto-zoom is commented-out, as I didn't find a nice overlay that would describe that one has to hold CTRL to enable scroll. The solution works though.

### TO-DO PROBLEMS
- **var translation;** find another way to return a translation from a function **getTranslation()** - return doesn't work, same thing is hacked in static pages with **var translatedLabel;**
- double cleaning of forEach arrays (**RemoveIcons()** and **currentVisibleLayer**) - currently doesn't work as designed as sometimes one has to press Hide routes button twice to eliminate all visible layers
- generate image gallery pages using gatsby (I would recommend using NodeJS fs for reading files and append childs wih for loop for each picture in each folder based on geojson routeParts)