## Keegan's "Neighborhood" Restaurant Map

To view the final project please view [this link](http://madebykeegan.com/frontend-nanodegree-neighborhood-map/)

### Overview
This project uses JavaScript, jQuery, knockoutJS, Google Maps API, and Google Material Design Lite.
Functionality of the web applications includes:
- Map Markers for my neighborhood restaurant locations 
- A list view of all locations
- Search functionality to filter based on name

### How to Run
To run the website follow these methods

- visit [this link](http://madebykeegan.com/frontend-nanodegree-neighborhood-map/)
- download the repository, and directly open index.html with a browser
- create a HTTP server on the root folder using Python, apache or other similar web server. Steps below. 

1. Using the command prompt or terminal

  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 9292
  ```
2. Open a browser and visit localhost:9292 (http://localhost:[your_port])

## How the app works 

1. This web application uses Google Maps API.
2. Using Foursquare integration, the app checks to see if the location is open for that day as well as the hours.
3. The application also notifies users in an error occures.
4. The sidebar displays all locations, and using the search box allows filtering out the location by name.
5. Selecting or clicking on the location name will trigger the marker to bounce and display addition information within the information window.
