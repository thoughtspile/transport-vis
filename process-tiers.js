var _ = require('lodash');

module.exports = function(data, tierCount) {
    // prepare line hash
    var lineNames = _.union.apply(null, _.map(data, 'lines'));
    var stopsByLine = {};
    _.forEach(lineNames, function(line) {
        stopsByLine[line] = [];
    });
    var getStopsByLine = function(i) {
        return stopsByLine[i];
    };
    _.forEach(data, function(st, i) {
        _.invoke(st.lines.map(getStopsByLine), 'push', st);
    });

    data.forEach(function(item) {
        item.tiers = [[item]];
        item.tiers.length = tierCount;
        item.tierCount = tierCount;
    });
    _.range(1, tierCount).forEach(function(i) {
        data.forEach(function(item) {
            if (i > item.tierCount)
                return;
            var lines = _.union.apply(_, _.map(item.tiers[i - 1], 'lines'));
            var currTier = _.union.apply(_, lines.map(getStopsByLine));
            item.tiers[i] = currTier;
            if (_.isEmpty(_.difference(currTier, item.tiers[i - 1]))) {
                _.fill(item.tiers, currTier, i);
                item.tierCount = i;
            }
        });
    });
    data.forEach(function(item) {
        item.tiers = _.map(item.tiers, 'length');
        item.importance = _.sum(item.tiers.map((w, i) => w / (i + 1)));
    });
}
