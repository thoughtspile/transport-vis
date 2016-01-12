function behaviors(focused) {
    function toggleActivated(item, projection) {
        console.log('HELLO')
        if (focused.indexOf(item) == -1)
            focused.push(item);
        else
            focused.splice(focused.indexOf(item), 1);
        toggleMeta.call(this, item);
        // toggleTier1.call(this, item);
        toggleCluster.call(this, item, projection);
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

    return {
        toggleActive: toggleActivated
    }
};
