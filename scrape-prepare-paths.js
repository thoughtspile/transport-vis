var translit = require('transliterate');

module.exports = function(routes) {
    routes = routes.sort();
    var root = 'http://protransport.msk.ru/marshruty/';
    var cats = { 'А': 'avtobus', 'Тм': 'tramvai', 'Тб': 'trolleybus' };
    return routes.reduce((acc, short) => {
        var type = short[0];
        if (type == 'Т')
            type += short[1];
        var number = translit(short.substr(type.length).replace(/\s?\n?/g, ''));
        if (cats[type])
            acc.push({ key: short, path: root + cats[type] + '/' + number });
        return acc;
    }, []);
}
