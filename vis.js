(function() {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var x = d3.scale.linear().domain([0, w]).range([0, w]);
    var y = d3.scale.linear().domain([0, h]).range([h, 0]);
    var zoom = d3.behavior.zoom()
        .scaleExtent([.1, 20])
        .x(x).y(y)
        .on('zoom', fzoom);

    var svg = d3.select("body").append("svg")
        .attr("width", w)
        .attr("height", h)
        .call(zoom)
        .append('g');

    var visible = stops.filter(function(st) { return st.tier1 > 100; });
    var map = svg.selectAll('circle')
        .data(visible)
        .enter()
        .append('g')
        .attr('x', function(pt) { return pt.x; })
        .attr('y', function(pt) { return h - pt.y; });
    map.append('circle')
        .attr('opacity', '.05')
        .attr('r', function(pt) { return pt.tier2 / 100; });
    map.append('circle')
        .attr('opacity', '.5')
        .attr('r', function(pt) { return pt.tier1 / 100; });
    map.on('click', toggleActivated);

    function toggleActivated(item) {
        var sel = d3.select(this);
        if (sel.select('text').empty()) {
            sel.append('text')
                .attr('y', -10)
                .text(item.name)
            sel.selectAll('text')
                .data(item.lines)
                .enter()
                .append('text')
                    .attr('class', 'route-list')
                    .attr('y', function(a, i) { return 8 * i; })
                    .text(function(line) { return line; });
        }
        item.expanded = !item.expanded;
        toggleTier1(item, item.expanded);
        sel.attr('class', item.expanded? 'active': 'inactive');
    }

    function toggleTier1(src, state) {
        map.filter(function(item) {
                return item.lines.some(function(line) {
                    return src.lines.indexOf(line) != -1;
                });
            })
            .each(function(item) {
                item.tier1sel = (item.tier1sel || 0) + (state? 1: -1);
            })
            .classed('tier1', function(item) {
                return item.tier1sel > 0;
            });
    }

    function fzoom(d) {
        console.log(svg)
        map.attr("transform", function (d) {
            return "translate(" + x(d.x) + "," + y(d.y) + ")";
        });
    }
}());
