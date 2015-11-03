var io = require('fs')

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

function mean(arr, key) {
    return arr.reduce(function(a, item) {
        return a + item[key]; }, 0) / arr.length;
}

function union(arr, into) {
    return arr.reduce(function(acc, el) {
        if (acc.indexOf(el) === -1)
            acc.push(el);
        return acc;
    }, into);
}

io.readFile(__dirname + '/ground.json', function(err, str) {
    var data = JSON.parse(str).map(function(item) {
        var item = {
            x: item['Cells']['Longitude_WGS84'],
            y: item['Cells']['Latitude_WGS84'],
            lines: item['Cells']['RouteNumbers'].replace(' ', '').split(';')
        };
        item.x = (item.x - 37.3) * 1000;
        item.y = (item.y - 55.5) * 1300;
        return item;
    });

    data = data.reduce(function(clusters, pt) {
        var close = clusters.filter(function(cluster) {
            return reach(pt, cluster);
        });
        if (close.length == 0) {
            clusters.push(pt);
            return clusters;
        }
        close.forEach(function(clust) {
            clusters.splice(clusters.indexOf(clust), 1);
        }, []);
        close.push(pt);
        var aggregate = {
            x: mean(close, 'x'),
            y: mean(close, 'y'),
            lines: close.reduce(function(acc, item) {
                return union(item.lines, acc);
            }, [])
        };
        clusters.push(aggregate);
        return clusters;
    }, []);
    console.log(data.length, 'aggregated');

    var lines = {};
    data.forEach(function(item) {
        item.lines.forEach(function(lineI) {
            lines[lineI] = (lines[lineI] || 0) + 1;
        });

        item.lineCount = item.lines.length;
    });

    var lineTiers = {};
    data.forEach(function(item) {
        item.tier1 = item.lines.reduce(function(acc, lineI) {
            return acc + lines[lineI];
        }, 0);
        item.lines.forEach(function(lineI) {
            lineTiers[lineI] = union(item.lines, lineTiers[lineI] || []);
        });
    });

    data.forEach(function(item) {
        item.tier2 = item.lines.reduce(function(acc, lineI) {
            return acc + lineTiers[lineI].reduce(
                function(acc, lineI) { return acc + lines[lineI]; },
                0);
        }, 0);
    })

    console.log(data[0])
    io.writeFile(
        __dirname + '/ground_coord.json',
        'var stops = ' + JSON.stringify(data, null, '\t')
    );
});
