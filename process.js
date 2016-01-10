var io = require('fs')
var _ = require('lodash')

var processTiers = require('./process-tiers.js')
var cluster = require('./process-cluster.js')


function mean(arr, key) {
    return _.sum(arr, key) / arr.length;
}

function renameAndNormalize(acc, raw, i) {
    var item = {
        x: raw['Cells']['Longitude_WGS84'],
        y: raw['Cells']['Latitude_WGS84'],
        name: raw['Cells']['StationName'] || raw['Cells']['Name'],
        lines: raw['Cells']['RouteNumbers'].replace(/ /g, '').split(';')
    };

    item.name = [item.name.replace(/\s*\(((пос|выс|к\/ст)\.?\,?\s*)+\)\s*/g, '')];

    if (!item.lines[0].match(/Маршруты\s?Мосгортранса\s?не\s?проходят/))
        acc.push(item);

    return acc;
}

function logResults(data) {
    function distr(data) {
        return [_.min(data), mean(data), _.max(data)].join(', ');
    }

    console.log('tier 1:', distr(_.map(data, 'tiers[1]')));
    console.log('tier 2:', distr(_.map(data, 'tiers[2]')));
    console.log('tier count:', distr(_.map(data, 'tierCount')));
    console.log('sample: ', data[0]);
}


var data = _.chain(io.readFileSync(__dirname + '/ground.json'))
    .thru(JSON.parse)
    .tap(function(data) { console.log(data[0]); })
    // .take(50)
    .reduce(renameAndNormalize, [])
    .reduce(cluster, [])
    .tap(function(data) { console.log(data.length, 'aggregated'); })
    .tap(data => processTiers(data, 5))
    .tap(data => data.forEach(st => st.name = st.name.join(', ')))
    .tap(logResults)
    .value();


io.writeFileSync(
    __dirname + '/ground_coord.json',
    'var stops = ' + JSON.stringify(data, null, '\t')
);
