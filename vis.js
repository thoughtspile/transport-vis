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
        var tierZoom = d3.scale.linear()
            .domain([12, 8])
            .range(tierRange);
        var rScale = d3.scale.linear()
            .domain([0, maxTier]);

        var visible = stops.slice();
        var focused = [];
        var interactions = behaviors(focused);

        stops.forEach(function(stop) {
            stop.latLng = new google.maps.LatLng(stop.y, stop.x);
        });

        overlay.draw = function(evt) {
            alert(evt)
            // var s = Date.now();
            var projection = this.getProjection();
            var viewport = this.getMap().getBounds();
            var zoom = this.getMap().getZoom();

            // visible = stops.filter(function(stop) {
            //     var visible = viewport.contains(stop.latLng);
            //     var big = stop.importance > tierZoom(zoom);
            //     return visible && big;
            // })
            rScale.range([0, maxR * Math.pow(zoom / 15, 4)]);

            var marker = layer.selectAll("svg")
                .data(visible);
            marker.exit().remove();
            marker.enter()
                .append('svg')
                .attr('viewBox', '0 0 2 2')
                .attr('class', 'marker')
                .append('circle')
                    .attr('opacity', .5)
                    .attr('r', '1')
                    .attr('cx', '1')
                    .attr('cy', '1')
                    .on('click', function(d) {
                        interactions.toggleActive.call(this, d, projection)
                    });
            marker.each(transform).each(function(d) { renderCluster.call(this, d, projection) });

            function transform(d) {
                var offset = rScale(d.importance);
                var pos = projection.fromLatLngToDivPixel(d.latLng);

                return d3.select(this)
                    .attr('width', 2 * offset)
                    .attr('height', 2 * offset)
                    .style("left", pos.x - offset + "px")
                    .style("top", pos.y - offset + "px");
            }

            // var clusters = d3.select(containers.clusters);
            // console.log(Date.now() - s)
        };
    });
}({ map: '#map-container', clusters: '#cluster-container' }));
