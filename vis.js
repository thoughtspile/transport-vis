(function() {
    //stops = stops.slice(0, 400);
    var w = 600,
        h = 600;

    var x = d3.scale.linear().domain([0, w]).range([0, w]);
    var y = d3.scale.linear().domain([0, h]).range([h, 0]);

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 20])
        .x(x).y(y)
        .on('zoom', fzoom);

    var drag = d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("drag", dragged);

    var svg = d3.select("body").append("svg")
        .attr("width", w)
        .attr("height", h)
        .call(zoom)
        .call(drag);

    var visible = stops.slice();
    var map = svg.selectAll('circle').data(visible).enter().append('g');
    map.append('circle')
        .attr('opacity', '.05')
        .attr('r', function(pt) { return pt.tier2 / 1000; })
        .attr('cx', function(pt) { return pt.x; })
        .attr('cy', function(pt) { return h - pt.y; });
    map.append('circle')
        .attr('opacity', '.5')
        .attr('r', function(pt) { return pt.tier1 / 100; })
        .attr('cx', function(pt) { return pt.x; })
        .attr('cy', function(pt) { return h - pt.y; })
        .on('click', function(c, pt) {
        });
    map.on('click', function(item) {
        console.log(this, item)
        d3.select(this)
            .append('text')
            .attr('x', item.x)
            .attr('y', h - item.y)
            .attr('font-family', 'sans-serif')
            .attr('font-size', '8')
            .text(item.lines.join(',\n'));
    })

    function fzoom() {
        map.attr("transform", transform);
    }
    function dragged(d) {
        svg.attr('transform', transform(d3.event));
    }
    function transform(d) {
        return "translate(" + x(d.x) + "," + y(d.y) + ")";
    }
}());
