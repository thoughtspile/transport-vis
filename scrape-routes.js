var fs = require('fs')

var getPaths = require(__dirname + '/scrape-prepare-paths')
var scrapeTimetable = require(__dirname + '/scrape-timetable')
var scrapeIds = require(__dirname + '/scrape-ids')

var paths = getPaths(JSON.parse(fs.readFileSync(__dirname + '/routes.json')))
var timetables = []
var rem = paths.length

function handleIds(data) {
    var id = parseInt(data.ids[Object.keys(data.ids)[0]])
    if (isNaN(id)) {
        rem--
        return;
    }
    scrapeTimetable(data.key, id, handleTimetable)
}

function handleTimetable(data) {
    rem--
    timetables.push(data)
    if (timetables.length % 20 == 0 || rem == 0)
        fs.writeFile(
            __dirname + '/timetable.json', JSON.stringify(timetables, null, '  '),
            () => console.log('export', rem)
        );
};

paths.forEach(function(path, i) {
    setTimeout(() => scrapeIds(path.key, path.path, handleIds), 300 * i);
});
