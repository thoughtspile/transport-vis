var request = require('request')
var cheerio = require('cheerio')

module.exports = function(key, path, fn) {
    request.get({ url: path }, function(error, response, body) {
        var $ = cheerio.load(body)
        var res = {
            key: key,
            ids: {}
        }
        $('#accordion h4 a').each(function() {
            var desc = $(this).text()
            var days = desc.match(/\((.*)\)$/)[1]
            res.ids[days] = $(this).attr('id_rasp')
        })
        fn(res)
    });
}
