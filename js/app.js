//Initialize Google Map Location

var map;

function initMap() {
    //Create map options
    var mapOptions ={
        center: {lat:  37.762906, lng: -122.244408},
        zoom: 15,
        mapTypeControl: false,
        mapTypeId: 'roadmap'
    };


    map = new google.maps.Map(document.getElementById('map'), mapOptions);


    //Create the Location Movel View from the locations array
    var LocationViewModel = function() {
        var self = this;

        //create a location array
        this.locationList = ko.observableArray([]);

        // create the list of locations from the model
        locations.forEach(function(locItem) {
            self.locationList.push(new Location(locItem) );
        });
    };

    //Create Location Object      
    var Location = function(data) {
        this.title = ko.observable(data.title); 

        this.lat = ko.observable(data.location.lat);
        this.lng = ko.observable(data.location.lng);
        this.address = ko.observable(data.address);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.location.lat, data.location.lng),
            title: this.title,
            map: map
          });

        // Set the marker as a knockout observable
        this.marker = ko.observable(marker);
    };
    
    ko.applyBindings( new LocationViewModel() );

}

