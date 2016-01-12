var initGoogleMap = function(container, callback) {
    var customMapType = new google.maps.StyledMapType([
        {
            "stylers": [ { "invert_lightness": true } ]
        }, {
            "featureType": "poi",
            "stylers": [ { "visibility": "off" } ]
        }, {
            "elementType": "labels",
            "stylers": [ { "visibility": "off" } ]
        }, {
            "featureType": "landscape.man_made",
            "stylers": [ { "visibility": "off" } ]
        }, {
            featureType: "road.highway",
            stylers: [{ "gamma": 0.4 }]
        }
    ]);
    var customMapTypeId = 'custom_style';

    var googleMap = new google.maps.Map(d3.select(container).node(), {
        zoom: 10,
        center: new google.maps.LatLng(55.751244, 37.618423),
        disableDoubleClickZoom: true,
        backgroundColor: '#181818',
        mapTypeControlOptions: {
            mapTypeIds: [customMapTypeId]
        }
    });

    googleMap.mapTypes.set(customMapTypeId, customMapType);
    googleMap.setMapTypeId(customMapTypeId);

    var overlay = new google.maps.OverlayView();
    // google.maps.event.trigger(googleMap, 'resize');
    overlay.onAdd = function() {
        callback.call(this, overlay);
        googleMap.addListener('center_changed', function(e) {
            overlay.draw.call(overlay, e);
        });
        // googleMap.addListener('zoom_changed', overlay.draw.bind(overlay));
    };
    overlay.setMap(googleMap);

};
