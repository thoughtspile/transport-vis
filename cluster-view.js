
var clusterScaleX = d3.scale.linear().range([5, 295]).domain([0, 0]);
var clusterScaleY = d3.scale.linear().range([145, 5]).domain([0, 0]);

function renderCluster(item) {
    // var svgs = clusters.selectAll('div').data(focused);
    // var cluster = svgs.enter()
    //     .append('div')
    //     .classed('row cluster', true)
    //     .append('svg');
    //
    // var normStops = function(cluster) {
    //     var stops = cluster.stops;
    //     var xr = d3.extent(stops.map(function(stop) { return stop.x; }));
    //     var yr = d3.extent(stops.map(function(stop) { return stop.y; }));
    //     var scale = clusterScaleX.domain();
    //     var top = d3.max([xr[1] - xr[0], yr[1] - yr[0], scale[1]]);
    //     clusterScaleX.domain([0, top]);
    //     clusterScaleY.domain([0, top]);
    //     return stops.map(function(stop) {
    //         return {
    //             x: (stop.x - xr[0]),
    //             y: (stop.y - yr[0])
    //         };
    //     })
    // };
    //
    // var stopDists = function(cluster) {
    //     return normStops(cluster).reduce(function(acc, stop, i, arr) {
    //         for (var j = 0; j < i; j++)
    //             acc.push([[arr[j].x, arr[j].y], [stop.x, stop.y]]);
    //         return acc;
    //     }, []);
    // };
    //
    // cluster.selectAll('circle').data(normStops)
    //     .enter()
    //         .append('circle')
    //         .attr('r', 5)
    //         .attr('cx', function(stop) { return clusterScaleX(stop.x); })
    //         .attr('cy', function(stop) { return clusterScaleY(stop.y); });
    // cluster.selectAll('line').data(stopDists)
    //     .enter()
    //         .append('line')
    //         .attr('x1', function(d) { return clusterScaleX(d[0][0]); })
    //         .attr('y1', function(d) { return clusterScaleY(d[0][1]); })
    //         .attr('x2', function(d) { return clusterScaleX(d[1][0]); })
    //         .attr('y2', function(d) { return clusterScaleY(d[1][1]); })
    //         .style('stroke', 'black');
    // svgs.exit().remove();
}

function toggleCluster(item) {
    renderCluster.call(this, item);
}
