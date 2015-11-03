(function() {
    var w = 600,
        h = 600;
    var svg = d3.select("body").append("svg")
        .attr("width", w)
        .attr("height", h)
        .selectAll('circle');

    var stopData = stops;
    stops = svg.data(stopData).enter().append('g');
    stops;
    stops.append('circle')
        .attr('fill', 'rgba(0,0,0,.05)')
        .attr('r', function(pt) { return pt.tier2 / 10000; })
        .attr('cx', function(pt) { return pt.x; })
        .attr('cy', function(pt) { return h - pt.y; });
    stops.append('circle')
        .attr('fill', 'rgba(0,0,0,.5)')
        .attr('r', function(pt) { return pt.tier1 / 100; })
        .attr('cx', function(pt) { return pt.x; })
        .attr('cy', function(pt) { return h - pt.y; })
        .on('mouseover', function(c) {
            d3.select(this).attr('fill', 'red');
        })
        .on('mouseleave', function(c) {
            d3.select(this).attr('fill', 'rgba(0,0,0,.05)');
        });
}());
