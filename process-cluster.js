var _ = require('lodash')

function mean(arr, key) {
    return _.sum(arr, key) / arr.length;
}

var walk2 = .00001;
var walk = Math.sqrt(walk2);
var reach = function(c1, c2) {
    var dx = Math.abs(c1.x - c2.x);
    if (dx > walk)
        return false;
    var dy = Math.abs(c1.y - c2.y);
    if (dy > walk)
        return false;
    return dx * dx + dy * dy <= walk2;
};

module.exports = function cluster(clusters, pt) {
    var close = _.remove(clusters, reach.bind(null, pt));
    close.push(pt);
    clusters.push({
        x: mean(close, 'x'),
        y: mean(close, 'y'),
        name: _.union.apply(null, _.map(close, 'name')),
        lines: _.union.apply(null, _.map(close, 'lines')),
        stops: _.union.apply(null, close.map(function(clust) {
            return clust.stops || [{ x: clust.x, y: clust.y }];
        }))
    });
    return clusters;
}
