//Initialize Google Map Location

var map;

//Info window moved outside of object, this makes sure only one box can be opened at a time.        
var largeInfowindow = new google.maps.InfoWindow({
    content: '<div><p>This is the default content</p></div>'
});

//Create Location Object      
var Location = function(data) {
    var marker;
    this.title = ko.observable(data.title); 
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
    this.address = ko.observable(data.address);
//    marker = new google.maps.Marker({
//        position: new google.maps.LatLng(data.location.lat, data.location.lng),
//        title: data.title,
//        address: data.address,
//        map: map
//      });

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

    // Set the marker as a knockout observable
//    this.marker = ko.observable(marker);
};


var LocationViewModel = function() {
    'use strict';
    var self = this;
    //create a location array
    self.locationList = ko.observableArray([]);
    //create a location array for search
//    self.filteredLocationlist = ko.observableArray([]);
    
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
    
    self.createLocations = function(){
        // create the list of locations from the model
        locations.forEach(function(locItem) {
            self.locationList.push(new Location(locItem) );
        });
    };

       

        

    google.maps.event.addDomListener(window, 'load', function() {
         self.initialize();
    });
    
};

//intital map end  

//Launch everything :)    
ko.applyBindings( new LocationViewModel() );