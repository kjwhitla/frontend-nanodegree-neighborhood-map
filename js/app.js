//Initialize Google Map Location

var map;

//Info window moved outside of object, this makes sure only one box can be opened at a time.        
var largeInfowindow = new google.maps.InfoWindow({
    content: '<div><p>This is the default content</p></div>'
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
    
    // Sets the currenter marker to bounce once when clicked
    self.setMarkerAnimation = function(location) {
        location.marker().setAnimation(google.maps.Animation.BOUNCE);
        setTimeout( function() { location.marker().setAnimation(null); }, 750);
    };
    
    

  //This listener looks for the loading of the page and launches the below functions
    google.maps.event.addDomListener(window, 'load', function() {
        self.initialize();
        self.createLocations();
        self.locationClickFunc();
    });
    
};


//Launch everything :)    
ko.applyBindings( new LocationViewModel() );


//    function populateInfoWindow(marker, infowindow) {
//    // Check to make sure the infowindow is not already opened on this marker.
//        if (infowindow.marker != marker) {
//        infowindow.marker = marker;
//        infowindow.setContent('<div>' + marker.title + '<br/>' + marker.address + '</div>');
//        infowindow.open(map, marker);
//        // Make sure the marker property is cleared if the infowindow is closed.
//            infowindow.addListener('closeclick', function() {
//             infowindow.marker = null;
//            });
//        }
//    }


    // Create an onclick event to open an infowindow at each marker.
//    marker.addListener('click', function() {
//        populateInfoWindow(this, largeInfowindow);
//    });


