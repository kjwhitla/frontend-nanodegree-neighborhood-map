//Initialize Google Map Location

var map;

//Info window moved outside of object, this makes sure only one box can be opened at a time.       
var largeInfowindow = new google.maps.InfoWindow({
    content: 'Hello World'
});

//Create Location Object      
var Location = function(data) {
    var marker;
    this.name = ko.observable(data.name); 
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.address = ko.observable(data.address);
    
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat(), this.lng()),
        name: this.name,
        address: this.address,
        map: map
      });
    
    // Set the marker as a knockout observable
    this.marker = ko.observable(marker);
};

var LocationViewModel = function() {
    'use strict';
    var self = this;
    //create a location array
    self.locationList = ko.observableArray([]);
    
    //create a location array for search
//    self.filteredLocationlist = ko.observableArray([]);
    
    
    //This function initializes and creates the google map
    self.initialize = function(){
        //Create map options
        var mapArea = document.getElementById('map');
        var mapOptions ={
            center: {lat:  37.762906, lng: -122.244408},
            zoom: 15,
            mapTypeControl: false,
            mapTypeId: 'roadmap'
        };
         map = new google.maps.Map(mapArea, mapOptions);
    };
    
    //This function creates a list of locations from the model.
    self.createLocations = function(){
        locations.forEach(function(loc) {
            self.locationList.push(new Location(loc) );
        });
    };
    
    //This function sets up a listener for a click on each location
    self.locationClickFunc = function() {
        self.locationList().forEach(function(location) {
          google.maps.event.addListener(location.marker(), 'click', function() {
            self.locationClick(location);
          });
        });
    };
    
    //This function handles the clicking on a location
    self.locationClick = function(location) {
        // Set the content for the information window
        var locationContent = '<div><h5>' + location.name() + '</h5><p>' + location.address() + '</p></div>';
        largeInfowindow.setContent(locationContent);

        //This makes the viewpoint center on the location that you clicked
        map.panTo(new google.maps.LatLng(location.lat(), location.lng()));

        //This open the information window when the marker is clicked
        largeInfowindow.open(map, location.marker());

        // Current location marker will bounces once when clicked
        self.setMarkerAnimation(location);
    };
    
    //This function will cause the current marker to bounce when clicked
    self.setMarkerAnimation = function(location) {
        location.marker().setAnimation(google.maps.Animation.BOUNCE);
        setTimeout( function() { location.marker().setAnimation(null); }, 750);
    };
    
    //This function will filter the locations based on what is searched
    //TODO:
    

  //This listener looks for the loading of the page and launches the below functions
    google.maps.event.addDomListener(window, 'load', function() {
        self.initialize();
        self.createLocations();
        self.locationClickFunc();
    });
    
};

//Launch everything :)    
ko.applyBindings( new LocationViewModel() );
