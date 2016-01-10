var initGoogleMap = function(container, callback) {
    var customMapType = new google.maps.StyledMapType([
        {
            stylers: [
                {visibility: 'simplified'},
                {gamma: 0.5},
                {weight: 0.5}
            ]
        }, {
            elementType: 'labels',
            stylers: [{visibility: 'off'}]
        }], {
            name: 'Custom Style'
    });
    var customMapTypeId = 'custom_style';

    var googleMap = new google.maps.Map(d3.select(container).node(), {
        zoom: 10,
        center: new google.maps.LatLng(55.751244, 37.618423),
        disableDoubleClickZoom: true,
        mapTypeControlOptions: {
            mapTypeIds: [customMapTypeId]
        }
    });

    googleMap.mapTypes.set(customMapTypeId, customMapType);
    googleMap.setMapTypeId(customMapTypeId);

    var overlay = new google.maps.OverlayView();
    google.maps.event.trigger(googleMap, 'resize');
    overlay.onAdd = function() { callback.call(this, overlay); };
    overlay.setMap(googleMap);
};
