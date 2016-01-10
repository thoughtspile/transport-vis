(function(containers) {
    initGoogleMap(containers.map, function(overlay) {
        var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "stations");

        // model
        var padding = 20;
        var meanTier1 = 0;//d3.mean(stops.map(function(d) { return d.tier1; }));
        var maxTier2 = d3.max(stops.map(function(d) { return d.tiers[2]; }));
        var visible = stops.filter(function(st) { return st.tiers[1] > meanTier1; });
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
                .attr('opacity', '.5')
                .attr('cx', padding)
                .attr('cy', padding)
                .attr('r', function(pt) { return rScale(pt.tiers[1]); });
            marker.append('circle')
                .attr('opacity', '.25')
                .attr('cx', padding)
                .attr('cy', padding)
                .attr('r', function(pt) { if (!pt.tiers[2]) console.log(pt); return rScale(pt.tiers[2]); })
                .on('click', interactions.toggleActive);

            function transform(d) {
                d = new google.maps.LatLng(d.y, d.x);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", d.x - padding + "px")
                    .style("top", d.y - padding + "px");
            }

            var clusters = d3.select(containers.clusters);
        };
    });
}({ map: '#map-container', clusters: '#cluster-container' }));
