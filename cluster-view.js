var focused = [];
var offset = 4;


function normStops(cluster, projection) {
    // stops or bounds
    return cluster.map(function(stop) {
        var latLng = new google.maps.LatLng(stop.y, stop.x);
        return projection.fromLatLngToDivPixel(latLng);
    })
}

function stopDists(cluster) {
    return cluster.reduce(function(acc, stop, i, arr) {
        for (var j = 0; j < i; j++)
            acc.push([[arr[j].x, arr[j].y], [stop.x, stop.y]]);
        return acc;
    }, []);
}

function clusterGraph(d, projection) {
    var nodes = normStops(d.stops, projection);
    var edges = stopDists(nodes);
    var hull = normStops(d.bounds, projection);

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
        .style("overflow", 'visible')
        .style('z-index', -100);

    // drawStops(wrapper, nodes, left, top);
    // drawEdges(wrapper, edges, left, top);
    drawBounds(wrapper, hull, left, top);

    return wrapper;
}

function drawStops(wrapper, nodes, left, top) {
    wrapper.selectAll('circle')
        .data(nodes)
        .enter()
            .append('circle')
            .style('fill', 'white')
            .attr('r', offset);
    wrapper.selectAll('circle')
        .attr('cx', function(d) { return d.x - left + offset; })
        .attr('cy', function(d) { return d.y - top + offset; })
    return wrapper;
}

function drawEdges(wrapper, edges, left, top) {
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
    return wrapper;
}

function drawBounds(wrapper, nodes, left, top) {
    var drawHull = d3.svg.line()
        .x(function(d) { return d.x - left + offset; })
        .y(function(d) { return d.y - top + offset; })
        .interpolate("basis-closed");
    wrapper.selectAll('path')
        .data([this])
        .enter()
            .append('path')
            .style('stroke', 'white')
            .style('fill', 'white');
    wrapper.selectAll('path')
        .datum(nodes)
        .attr('d', drawHull);
    return wrapper;
}


function renderCluster(item, projection) {
    var detailed = d3.select('.stations')
        .selectAll('.detailed')
        .data(focused);

    detailed.enter()
        .append('svg')
        .attr('class', 'detailed');
    detailed.each(function(d) {
        return clusterGraph.call(this, d, projection);
    });
    detailed.exit().remove();
}

function toggleCluster(item, projection) {
    if (focused.indexOf(item) == -1)
        focused.push(item);
    else
        focused.splice(focused.indexOf(item), 1);
    renderCluster.call(this, item, projection);
}
