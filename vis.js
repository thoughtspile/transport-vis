(function(containers) {
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

    var googleMap = new google.maps.Map(d3.select(containers.map).node(), {
        zoom: 8,
        center: new google.maps.LatLng(55.751244, 37.618423),
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
        }
    });

    googleMap.mapTypes.set(customMapTypeId, customMapType);
    googleMap.setMapTypeId(customMapTypeId);

    var overlay = new google.maps.OverlayView();
    google.maps.event.trigger(googleMap, 'resize');
    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "stations");

        var w = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        // model
        var padding = 20;
        var meanTier1 = 0;//d3.mean(stops.map(function(d) { return d.tier1; }));
        var maxTier2 = d3.max(stops.map(function(d) { return d.tier2; }));
        var visible = stops.filter(function(st) { return st.tier1 > meanTier1; });
        var focused = [];
        var interactions = behaviors(focused);

        var rScale = d3.scale.linear().range([0, padding]).domain([0, maxTier2]);

        overlay.draw = function() {
            var projection = this.getProjection();

            var marker = layer.selectAll("svg")
                .data(visible)
                .each(transform)
                .enter()
                    .append('svg')
                    .each(transform)
                    .attr('class', 'marker')
                    .attr('width', 40)
                    .attr('height', 40);

            marker.append('circle')
                .attr('opacity', '.25')
                .attr('cx', padding)
                .attr('cy', padding)
                .attr('r', function(pt) { return rScale(pt.tier2); });
            marker.append('circle')
                .attr('opacity', '.5')
                .attr('cx', padding)
                .attr('cy', padding)
                .attr('r', function(pt) { return rScale(pt.tier1); });
            marker.on('click', interactions.toggleActive);

            function transform(d) {
                d = new google.maps.LatLng(d.y, d.x);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", d.x - padding + "px")
                    .style("top", d.y - padding + "px");
            }

            var clusters = d3.select(containers.clusters);
        };
    };
    overlay.setMap(googleMap);
}({ map: '#map-container', clusters: '#cluster-container' }));
