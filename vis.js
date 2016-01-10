(function(containers) {
    initGoogleMap(containers.map, function(overlay) {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "stations");

        // model
        var maxR = 20;
        var meanTier1 = 0;//d3.mean(stops.map(function(d) { return d.tier1; }));
        var imp = stops.map(function(d) { return d.importance; });
        var maxTier = d3.max(imp);
        var meanTier = d3.mean(imp);
        var tierRange = d3.extent(imp);
        var tierZoom = d3.scale.linear().domain([1, 8]).range(tierRange);
        var visible = [];
        var focused = [];
        var interactions = behaviors(focused);

        overlay.draw = function() {
            var projection = this.getProjection();
            var viewport = this.getMap().getBounds();
            var zoom = this.getMap().getZoom();

            visible = stops.filter(function(stop) {
                var visible = viewport.contains(new google.maps.LatLng(stop.y, stop.x));
                var big = stop.importance > tierZoom(zoom);
                return visible && big;
            })
            var rScale = d3.scale.linear().range([0, maxR * zoom / 30]).domain([0, maxTier]);

            var marker = layer.selectAll("svg")
                .data(visible)
                .each(transform)


            marker.exit().remove();

            marker.enter()
                .append('svg')
                .each(transform)
                .attr('class', 'marker')
                .attr('width', function(pt) { return Math.ceil(2 * rScale(pt.importance)); })
                .attr('height', function(pt) { return Math.ceil(2 * rScale(pt.importance)); })
                .append('circle')
                    .attr('opacity', .5)
                    .attr('r', function(pt) { return rScale(pt.importance); })
                    .attr('cx', function(pt) { return rScale(pt.importance); })
                    .attr('cy', function(pt) { return rScale(pt.importance); })
                    .on('click', interactions.toggleActive);

            function transform(d) {
                var offset = rScale(d.importance);
                d = new google.maps.LatLng(d.y, d.x);
                d = projection.fromLatLngToDivPixel(d);

                return d3.select(this)
                    .style("left", d.x - offset + "px")
                    .style("top", d.y - offset + "px");
            }

            var clusters = d3.select(containers.clusters);
        };
    });
}({ map: '#map-container', clusters: '#cluster-container' }));
