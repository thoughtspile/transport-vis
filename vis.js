(function(containers) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var x = d3.scale.linear().domain([0, w]).range([0, w]);
    var y = d3.scale.linear().domain([0, h]).range([h, 0]);
    var zoom = d3.behavior.zoom()
        .scaleExtent([.1, 20])
        .x(x).y(y)
        .on('zoom', function (d) {
            map.attr("transform", function (d) {
                return "translate(" + x(d.x) + "," + y(d.y) + ")";
            });
        });

    var svg = d3.select(containers.map).append("svg")
        .attr('width', w)
        .attr('height', h)
        .call(zoom)
        .append('g');

    // model
    var visible = stops.filter(function(st) { return st.tier1 > 100; });
    var focused = [];

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

    var clusters = d3.select(containers.clusters);

    function toggleActivated(item) {
        if (focused.indexOf(item) == -1)
            focused.push(item);
        else
            focused.splice(focused.indexOf(item), 1);
        toggleMeta.call(this, item);
        toggleTier1.call(this, item);
        toggleCluster.call(this, item);
    }


    function renderMeta(item) {
        if (item.rendered)
            return;
        var sel = d3.select(this);
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
        item.rendered = true;
    }

    function toggleMeta(item) {
        renderMeta.call(this, item);
        item.expanded = !item.expanded;
        d3.select(this).attr('class', item.expanded? 'active': 'inactive');
    }


    function getTier1(src) {
        return map.filter(function(item) {
                return item.lines.some(function(line) {
                    return src.lines.indexOf(line) != -1;
                });
            });
    }

    function toggleTier1(src) {
        getTier1(src)
            .each(function(item) {
                item.tier1sel = (item.tier1sel || 0) + (src.expanded? 1: -1);
            })
            .classed('tier1', function(item) {
                return item.tier1sel > 0;
            });
    }


    function renderCluster(item) {
        var svgs = clusters.selectAll('div').data(focused);
        svgs.enter()
            .append('div')
            .classed('row', true)
            .append('svg')
            .selectAll('circle').data(function(cluster) {
                var stops = cluster.stops;
                var xr = d3.extent(stops.map(function(stop) { return stop.x; }));
                var yr = d3.extent(stops.map(function(stop) { return stop.y; }));
                return stops.map(function(stop) {
                    return {
                        x: (stop.x - xr[0]) / (xr[1] - xr[0]) * 100,
                        y: 100 - (stop.y - yr[0]) / (yr[1] - yr[0]) * 100
                    };
                })
            })
            .enter()
                .append('circle')
                .attr('r', 5)
                .attr('cx', function(stop) { return stop.x; })
                .attr('cy', function(stop) { return stop.y; });
        svgs.exit().remove();
    }

    function toggleCluster(item) {
        renderCluster.call(this, item);
    }

}({ map: '#map-container', clusters: '#cluster-container' }));
