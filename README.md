Region mapper
=============

Application for mapping raster maps to SVG polygons.
It uses flood fill to detect closed areas on map and 
then detects area bounds and converts it to SVG polygons.

Application has mapping front-end and REST backend. 
Backend provides list of already mapped regions and saves new one to mongo.

Application now is one-time utility but with plans to expand it with 
better ui and few improvements.

# Development

Application is built with babel and webpack.

To build both front end and back end use `npm run build`

## Requirements
Application needs node `v6.1.0` or newer.

## Starting
`npm backend` and then navigate to http://localhost:8000
