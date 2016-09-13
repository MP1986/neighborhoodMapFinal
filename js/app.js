         var map;
        var markers = [];
        var polygon = null;
        var placeMarkers = [];

        function initMap() {

            if (typeof(elem) !== 'undefined') {
                console.log("Google Maps unavailable.")
            }
                map = new google.maps.Map(document.getElementById('map'), {
                    center: {
                        lat: 37.837959,
                        lng: -122.282402
                    },
                    zoom: 13
                });
                var locations = {
                    filters: ["Sudo Room", "Eli's Mile High Club", "East Bay Rats MC", "Oakland Metro Operahouse", "Lake Merritt", "The Crucible"],
                    items: [{
                        name: "Sudo Room",
                        title: "Sudo Room",
                        location: {
                            lat: 37.835000,
                            lng: -122.264186
                        },
                    }, {
                        name: "Eli's Mile High Club",
                        title: "Eli's Mile High Club",
                        location: {
                            lat: 37.825785,
                            lng: -122.269663
                        }
                    }, {
                        name: "East Bay Rats MC",
                        title: "East Bay Rats MC",
                        location: {
                            lat: 37.821413,
                            lng: -122.277001
                        }
                    }, {
                        name: "Oakland Metro Operahouse",
                        title: "Oakland Metro Operahouse",
                        location: {
                            lat: 37.797058,
                            lng: -122.277791
                        }
                    }, {
                        name: "Lake Merritt",
                        title: "Lake Merritt",
                        location: {
                            lat: 37.805146,
                            lng: -122.257394
                        }
                    }, {
                        name: "The Crucible",
                        title: "The Crucible",
                        location: {
                            lat: 37.804529,
                            lng: -122.290754
                        }
                    }]
                };
                var ViewModel = function(data) {
                    var self = this;
                    location.marker = marker;
                    self.listClick = function(loc) {
                        console.log(loc);
                        google.maps.event.trigger( marker, 'click' );
                    };
                    self.filters = ko.observableArray(data.filters);
                    self.filter = ko.observable('');
                    self.items = ko.observableArray(data.items);
                    self.filteredItems = ko.computed(function() {
                        var filter = self.filter().toLowerCase();
                        if (!filter || filter == "None") {
                            self.items().forEach(function(item) {
                                if (item.marker) {
                                    item.marker.setVisible(true);
                                }
                            });
                            return self.items();
                        } else {
                            return ko.utils.arrayFilter(self.items(), function(i) {
                                console.log(i);
                                //return i.title == filter;
                                //return true;
                                // If the location title contains the filter term
                                //if (i.title === filter) {
                                if (i.title.toLowerCase().indexOf(filter) !== -1) {
                                    // show the map marker
                                    if (typeof i.marker !== 'undefined') {
                                        i.marker.setVisible(true);
                                    }
                                    return true; // show the location in the list
                                } else {
                                    // hide the map marker 
                                    if (typeof i.marker !== 'undefined') {
                                        i.marker.setVisible(false);
                                    }
                                }
                            });
                        }
                    });

                    function hideListings() {
                        for (var i = 0; i < markers.length; i++) {
                            markers[i].setMap(null);
                        }
                    }
                };

//                function clickResponse(){}

                ko.applyBindings(new ViewModel(locations));
                var largeInfowindow = new google.maps.InfoWindow({
                    maxWidth: 200
                });
                var bounds = new google.maps.LatLngBounds();
                // The following group uses the location array to create an array of markers on initialize.
                for (var i = 0; i < locations.items.length; i++) {
                    // Get the position from the location array.
                    var position = locations.items[i].location;
                    var title = locations.items[i].title;
                    // Create a marker per location, and put into markers array.
                    var marker = new google.maps.Marker({
                        map: map,
                        position: position,
                        title: title,
                        animation: google.maps.Animation.DROP,
                        id: i
                    });
                    locations.items[i].marker = marker;
                    // Push the marker to our array of markers.
                    markers.push(marker);
                    // Create an onclick event to open an infowindow at each marker.
                    marker.addListener('click', function() {
                        var self = this;
                        populateInfoWindow(this, largeInfowindow),
                            this.setAnimation(google.maps.Animation.BOUNCE),
                            setTimeout(function() {
                                self.setAnimation(null);
                            }, 3500);
                    });
                    bounds.extend(markers[i].position);
                }
                // Extend the boundaries of the map for each marker
                map.fitBounds(bounds);
            }
            // This function populates the infowindow when the marker is clicked. We'll only allow
            // one infowindow which will open at the marker that is clicked, and populate based
            // on that markers position.
        function populateInfoWindow(marker, infowindow) {
            var clientID = 'ZMMEQGBA5QMTRLTFC3PMU2RLC3GCZ1QQTII5KH0ZKW5OOBX0',
                clientSecret = 'JCF0AU5HJQOF0GDX2RD3E3YGXMNPZUGSWCL3RFJTKFCIYW32',
                version = '20130815',
                query = marker.title,
                base_url = "https://api.foursquare.com/v2/venues/";
            // Check to make sure the infowindow is not already opened on this marker.
            if (infowindow.marker != marker) {
                $.ajax({
                    url: base_url + '/search',
                    dataType: 'json',
                    data: {
                        client_id: clientID,
                        client_secret: clientSecret,
                        near: 'San Francisco',
                        v: version,
                        query: query,
                        async: true
                    },
                }).done(function(venueResult) {
                    console.log("venue: ", venueResult);
                    console.log("venue id: ", venueResult.response.venues[0].id);

                    var tipsUrl = 'https://api.foursquare.com/v2/venues/' + venueResult.response.venues[0].id + '/tips';

                    $.ajax({
                        url: tipsUrl,
                        dataType: 'json',
                        data: {
                            client_id: clientID,
                            client_secret: clientSecret,
                            v: '20130815'
                        }
                    }).done(function(tipResult) {
                        console.log(tipResult);
                        console.log(typeof tipResult.response.tips.items[0].text);

                        if (typeof tipResult.response.tips.items[0].text === 'string') {
                            console.log('Is a string.');
                        }

                        getStreetViewFunction(venueResult.response.venues[0].location.address, tipResult.response.tips.items[0].text);
                    }).fail(function(error) {
                        getStreetViewFunction(venueResult, 'Tips are not available');
                    });
                    // Clear the infowindow content to give the streetview time to load.
                    infowindow.setContent('');
                    infowindow.marker = marker;
                    // Make sure the marker property is cleared if the infowindow is closed.
                    infowindow.addListener('closeclick', function() {
                        infowindow.marker = null;
                    });

                }).fail(function(error) {
                    getStreetViewFunction('error message', 'Tips are not available');
                });

                function getStreetViewFunction(venueResult, tipResult) {
                        var streetViewService = new google.maps.StreetViewService();
                        var radius = 50;
                        // In case the status is OK, which means the pano was found, compute the
                        // position of the streetview image, then calculate the heading, then get a
                        // panorama from that and set the options

                        function getStreetView(data, status) {
                                if (status == google.maps.StreetViewStatus.OK) {
                                    var nearStreetViewLocation = data.location.latLng;
                                    var heading = google.maps.geometry.spherical.computeHeading(
                                        nearStreetViewLocation, marker.position);
                                    infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div><div>' + venueResult + '</div><div>' + tipResult + '</div>');
                                    var panoramaOptions = {
                                        position: nearStreetViewLocation,
                                        pov: {
                                            heading: heading,
                                            pitch: 30
                                        }
                                    };
                                    var panorama = new google.maps.StreetViewPanorama(
                                        document.getElementById('pano'), panoramaOptions);
                                } else {
                                    infowindow.setContent('<div>' + marker.title + '</div>' +
                                        '<div>No Street View Found</div>');
                                }
                            }
                            // Use streetview service to get the closest streetview image within
                            // 50 meters of the markers position
                        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                        // Open the infowindow on the correct marker.
                        infowindow.open(map, marker);
                    }
                    // This function will loop through the listings and hide all but the one 
                    // currently selected in the dropdown menu.
            }
        }