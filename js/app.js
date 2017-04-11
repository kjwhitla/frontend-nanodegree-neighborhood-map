//This initializes the Google Map Location variable
var map, largeInfowindow;

//This is for the Info window moved outside of object, this makes sure only one box can be opened at a time.       

function initMap() {

    //This creates the Location object      
    var Location = function(data) {
        var marker;
        this.name = ko.observable(data.name);
        this.lat = ko.observable(data.lat);
        this.lng = ko.observable(data.lng);
        this.address = ko.observable(data.address);
        this.fs_id = ko.observable(data.fs_id);

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.lat(), this.lng()),
            name: this.name,
            address: this.address,
            map: map
        });


        // Set the marker as a knockout observable
        this.marker = ko.observable(marker);
    };


    //This is the View Model
    var LocationViewModel = function() {
        'use strict';
        var self = this;
        //This creates a location array
        self.locationList = ko.observableArray([]);


        //This creates a location array for search
        self.filteredLocationlist = ko.observableArray([]);

        //This function initializes and creates the google map
        self.initialize = function() {
            //This defines and creates map options
            var mapArea = document.getElementById('map');
            var mapOptions = {
                center: {
                    lat: 37.762906,
                    lng: -122.244408
                },
                zoom: 15,
                mapTypeControl: false,
                mapTypeId: 'roadmap'
            };
            map = new google.maps.Map(mapArea, mapOptions);
            largeInfowindow = new google.maps.InfoWindow();
        };


        //This function creates a list of locations from the model.
        self.createLocations = function() {
            locations.forEach(function(loc) {
                self.locationList.push(new Location(loc));
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

            //This iniates a few variables we will use
            var locationInfo, openEnd, openStart, openToday;

            //This gets and places the foursquare location id into a variable.
            var fs_loc_id = location.fs_id();

            //This constructs the query for the location
            var fs_url = "https://api.foursquare.com/v2/venues/" + fs_loc_id + "/hours?ll=37.762906,-122.244408&client_id=HHSAVK5VSRU5ANC041LORL3EVYNALVQUAOGXFK0EI2FFTAJD&client_secret=0W1QHH2UNTV2VDKN4RNJNHOWOT0A3XASURB55BQCB3YR4LDG&v=20170408";


            //This is the AJAX request
            $.ajax({
                type: "GET",
                url: fs_url,
                dataType: "jsonp",
                success: placeMarker,
                error: function(jqXHR, exception) {
                    var msg = '';
                    if (jqXHR.status === 0) {
                        msg = 'Not connect.\n Verify Network.';
                    } else if (jqXHR.status == 404) {
                        msg = 'Requested page not found. [404]';
                    } else if (jqXHR.status == 500) {
                        msg = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror') {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        msg = 'Time out error.';
                    } else if (exception === 'abort') {
                        msg = 'Ajax request aborted.';
                    } else {
                        msg = 'Uncaught Error.\n' + jqXHR.responseText;
                    }
                    alert(msg);
                }
            });

            //This function is triggered by the ajax request
            function placeMarker(data) {
                //This variable holds all the response data
                locationInfo = data.response.popular;

                //This checks to see if the variable has the information we are looking for.
                if (typeof locationInfo.timeframes['0'] !== 'undefined') {
                    openEnd = formatAMPM(locationInfo.timeframes[0].open[0].end);
                    openStart = formatAMPM(locationInfo.timeframes[0].open[0].start);
                    openToday = locationInfo.timeframes[0].includesToday;
                } else {
                    locationInfo = "";
                }

                //This function turns our military time to standard time and adds am/pm
                function formatAMPM(fourDigitTime) {
                    var hours24 = parseInt(fourDigitTime.substring(0, 2), 10);
                    var hours = ((hours24 + 11) % 12) + 1;
                    var amPm = hours24 > 11 ? 'pm' : 'am';
                    var minutes = fourDigitTime.substring(2);
                    return hours + ':' + minutes + amPm;
                }

                //This updates locationInfo before display
                if (openToday === true) {
                    locationInfo = "Open today   |  " + openStart + " - " + openEnd;
                } else {
                    locationInfo = "No Information Availible";
                }

                //This set the current content for the information window
                var locationContent = '<div><h5>' + location.name() + '</h5><p>' + location.address() + '<br/>' + locationInfo + '</p></div>';
                largeInfowindow.setContent(locationContent);

                //This makes the viewpoint center on the location that you clicked
                map.panTo(new google.maps.LatLng(location.lat(), location.lng()));

                //This open the information window when the marker is clicked
                largeInfowindow.open(map, location.marker());

                //This makes the current location marker bounces once when clicked
                self.setMarkerAnimation(location);
            }

        };

        //This function will cause the current marker to bounce when clicked
        self.setMarkerAnimation = function(location) {
            location.marker().setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                location.marker().setAnimation(null);
            }, 750);
        };

        //This function handles the filtering of locations from the users search
        self.queryLocations = function() {
            //This sets the filtered location list array to an empty array
            self.filteredLocationlist([]);
            //This gets the search string and the length of the location list
            var searchString = $('#q').val().toLowerCase();
            var len = self.locationList().length;

            //This function loops through each location within the list
            for (var i = 0; i < len; i++) {
                //This grabs the current name of the location
                var locationName = self.locationList()[i].name().toLowerCase();

                //This function checks to see if the location has a match within the search string
                if (locationName.indexOf(searchString) > -1) {
                    //This adds the location to the filtered location list
                    self.filteredLocationlist.push(self.locationList()[i]);
                    //This places the marker to the map
                    self.locationList()[i].marker().setMap(map);
                } else {
                    //This sets the marker to null
                    self.locationList()[i].marker().setMap(null);
                }
            }
        };

        //This listener looks for the loading of the page and launches the following functions
        google.maps.event.addDomListener(window, 'load', function() {
            self.initialize();
            self.createLocations();
            self.locationClickFunc();
            self.filteredLocationlist(self.locationList());

        });
    };

    //This launches everything :)    
    ko.applyBindings(new LocationViewModel());
//    console.log('finished');

}

function googleMapsError() {
    var errorMessage = "<h1>There is an error with Google Map at this moment. Please try again later!</h1>";
    alert(errorMessage);
//    console.log('error');
}