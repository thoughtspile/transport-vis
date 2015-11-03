var io = require('fs')

var walk2 = 2;
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

io.readFile(__dirname + '/ground.json', function(err, str) {
    var lines = {};
    var data = JSON.parse(str).map(function(item) {
        var item = {
            x: item['Cells']['Longitude_WGS84'],
            y: item['Cells']['Latitude_WGS84'],
            lines: item['Cells']['RouteNumbers'].replace(' ', '').split(';')
        };

        item.lines.forEach(function(lineI) {
            lines[lineI] = (lines[lineI] || 0) + 1;
        });

        item.lineCount = item.lines.length;
        item.x = (item.x - 37.3) * 1000;
        item.y = (item.y - 55.5) * 1300;

        return item;
    });

    var lineTiers = {};
    data.forEach(function(item) {
        item.tier1 = item.lines.reduce(function(acc, lineI) {
            return acc + lines[lineI];
        }, 0);
        item.lines.forEach(function(lineI) {
            lineTiers[lineI] = (lineTiers[lineI] || 0) + item.tier1;
        });
        //data.reduce(function(acc, item2) {
        //    return acc + reach(item, item2)? item2.lineCount: 0;
        //}, 0);
    });

    data.forEach(function(item) {
        item.tier2 = item.lines.reduce(function(acc, lineI) {
            return acc + lineTiers[lineI];
        }, 0);
    })

    console.log(data[0])
    io.writeFile(
        __dirname + '/ground_coord.json',
        'var stops = ' + JSON.stringify(data, null, '\t')
    );
});
