var _ = require('lodash')

function mean(arr, key) {
    return _.sum(arr, key) / arr.length;
}

var walk2 = .00001;
var walk = Math.sqrt(walk2);
var reach = function(c1, c2) {
    for (var i = 0; i < c1.length; i++) {
        for (var j = 0; j < c2.length; j++) {
            var dx = Math.abs(c1[i].x - c2[j].x);
            var dy = Math.abs(c1[i].y - c2[j].y);
            if (dx * dx + dy * dy <= walk2)
                return true;
        }
    }
    return false;
};

function rollup(cluster) {
    return {
        name: _.union.apply(null, _.map(cluster, 'name')),
        lines: _.union.apply(null, _.map(cluster, 'lines')),
        x: mean(cluster, 'x'),
        y: mean(cluster, 'y'),
        stops: cluster
    };
}

module.exports = function cluster(clusters, pt) {
    var seed = [ pt ]
    var close = _.remove(clusters, reach.bind(null, seed));
    close.push(seed);
    clusters.push(_.union.apply(null, close));
    return clusters;
}

module.exports.rollup = rollup;
