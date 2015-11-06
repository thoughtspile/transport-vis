var io = require('fs')
var _ = require('lodash')


function mean(arr, key) {
    return _.sum(arr, key) / arr.length;
}

function union(into, arr) {
    return arr.reduce(function(acc, el) {
        if (acc.indexOf(el) === -1)
            acc.push(el);
        return acc;
    }, into);
}

function distr(data) {
    return [_.min(data), mean(data), _.max(data)].join(', ');
}


var walk2 = 3;
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


function renameAndNormalize(acc, raw, i) {
    var item = {
        x: raw['Cells']['Longitude_WGS84'],
        y: raw['Cells']['Latitude_WGS84'],
        name: raw['Cells']['StationName'] || raw['Cells']['Name'],
        lines: raw['Cells']['RouteNumbers'].replace(/ /g, '').split(';')
    };
    item.x = (item.x - 37.3) * 1000;
    item.y = (item.y - 55.5) * 1300;
    item.name = [item.name
        .replace(/\s*\(((пос|выс|к\/ст)\.?\,?\s*)+\)\s*/g, '')];
    if (!item.lines[0].match(/Маршруты\s?Мосгортранса\s?не\s?проходят/))
        acc.push(item);
    return acc;
}

function cluster(clusters, pt) {
    var close = _.remove(clusters, reach.bind(null, pt));
    if (_.isEmpty(close)) {
        clusters.push(pt);
        return clusters;
    }
    close.push(pt);
    clusters.push({
        x: mean(close, 'x'),
        y: mean(close, 'y'),
        name: _.union.apply(null, _.map(close, 'name')),
        lines: _.union.apply(null, _.map(close, 'lines'))
    });
    return clusters;
}


var data = _.chain(io.readFileSync(__dirname + '/ground.json'))
    .thru(JSON.parse)
    .tap(function(data) { console.log(data[0]); })
    //.take(500)
    .reduce(renameAndNormalize, [])
    .reduce(cluster, [])
    .tap(function(data) { console.log(data.length, 'aggregated'); })
    .value();

var lineNames = _.union.apply(null, _.map(data, 'lines'));

var stopsByLine = {};
_.forEach(lineNames, function(line) { stopsByLine[line] = []; });
var getStopsByLine = function(i) { return stopsByLine[i]; };
_.forEach(data, function(st, i) {
    _.invoke(st.lines.map(getStopsByLine), 'push', i);
});

var intersecting = _.reduce(data, function(counts, st) {
    _.forEach(st.lines, function(lineI) {
        counts[lineI] = _.union(st.lines, counts[lineI]);
    });
    return counts;
}, {});
var getIntersecting = function(i) { return intersecting[i]; };

data.forEach(function(item) {
    item.tier1 = item.lines
        .map(getStopsByLine)
        .reduce(union, [])
        .length;
});

data.forEach(function(item) {
    item.tier2 = _.chain(item.lines)
        .map(getIntersecting)
        .invoke('map', getStopsByLine)
        .invoke('reduce', union, []) // this reference worries me
        .reduce(union, [])
        .size()
        .value();
});

data.forEach(function(st) { st.name = st.name.join(', '); });

console.log('tier 1:', distr(_.map(data, 'tier1')));
console.log('tier 2:', distr(_.map(data, 'tier2')));
console.log('sample: ', data[0]);

io.writeFileSync(
    __dirname + '/ground_coord.json',
    'var stops = ' + JSON.stringify(data, null, '\t') +
    ';\nvar limits = ' +
    JSON.stringify([
        [_.min(data, 'x').x, _.max(data, 'x').x],
        [_.min(data, 'y').y, _.max(data, 'y').y]
    ])
);
