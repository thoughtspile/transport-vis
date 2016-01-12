
// var clusterScaleX = d3.scale.linear().range([5, 295]).domain([0, 0]);
// var clusterScaleY = d3.scale.linear().range([145, 5]).domain([0, 0]);

var focused = [];

function renderCluster(item, projection) {
    var offset = 4;

    // project coordinates
    var normStops = function(cluster) {
        console.log(cluster)
        return cluster.stops.map(function(stop) {
            var latLng = new google.maps.LatLng(stop.y, stop.x);
            return projection.fromLatLngToDivPixel(latLng);
        })
    };

    // get cluster graph
    var stopDists = function(cluster) {
        return cluster.reduce(function(acc, stop, i, arr) {
            for (var j = 0; j < i; j++)
                acc.push([[arr[j].x, arr[j].y], [stop.x, stop.y]]);
            return acc;
        }, []);
    };

    function clusterGraph(d) {
        var nodes = normStops(d);
        var edges = stopDists(nodes);

        var left = d3.min(nodes.map(function(p) { return p.x; }));
        var right = d3.max(nodes.map(function(p) { return p.x; }));
        var top = d3.min(nodes.map(function(p) { return p.y; }));
        var bottom = d3.max(nodes.map(function(p) { return p.y; }));
        var w = right - left + 2 * offset;
        var h = bottom - top + 2 * offset;

        var wrapper = d3.select(this)
            .attr('width', w)
            .attr('height', h)
            .style("left", left - offset + "px")
            .style("top", top - offset + "px")
            .style('z-index', -100);
        wrapper.selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .style('fill', 'white')
            .attr('r', offset);

        wrapper.selectAll('line')
            .data(edges)
            .enter()
            .append('line')
            .style('stroke', 'white')
            .style('opacity', .05);

        wrapper.selectAll('line')
            .attr('x1', function(d) { return d[0][0] - left + offset; })
            .attr('y1', function(d) { return d[0][1] - top + offset; })
            .attr('x2', function(d) { return d[1][0] - left + offset; })
            .attr('y2', function(d) { return d[1][1] - top + offset; });

        wrapper.selectAll('circle')
            .attr('cx', function(d) { return d.x - left + offset; })
            .attr('cy', function(d) { return d.y - top + offset; })
        return wrapper;
    }

    var detailed = d3.select('.stations')
        .selectAll('.detailed')
        .data(focused);

    detailed.enter()
        .append('svg')
        .classed('detailed', true);
    detailed.each(clusterGraph);
    detailed.exit().remove();
}

function toggleCluster(item, projection) {
    if (focused.indexOf(item) == -1)
        focused.push(item);
    else
        focused.splice(focused.indexOf(item), 1);
    renderCluster.call(this, item, projection);
}
