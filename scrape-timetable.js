var request = require('request')
var cheerio = require('cheerio')

module.exports = function(key, id, fn) {
    request.post({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        url: 'http://protransport.msk.ru/marshruty/search/get_new_mar.php',
        body: 'typeTr=1&type_rasp=2&id_rasp=' + id
    }, function(error, response, body) {
        // console.log(body)
        var $ = cheerio.load(body);
        var res = {
            key: key,
            timetable: []
        };
        $('.name_table td').each(function(i) {
            res.timetable[i] = {name: $(this).text()};
        });
        $('.time_table tr').each(function(i) {
            var temp = []
            var h = null
            $('td', this).each(function(j) {
                if (j % 2 == 0) {
                    h = $(this).text()
                } else {
                    $(this).contents().filter(function() {
                        return this.type === 'text'
                    }).each(function() {
                        temp.push(h + ':' + $(this).text())
                    })
                }
            })
            res.timetable[i].time = temp;
        })
        fn(res)
    });
};
