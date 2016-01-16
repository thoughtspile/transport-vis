var conv = require('convexhull-js')

function dot(a, b) {
    return a.x * b.x + a.y * b.y;
}

function norm(a) {
    return Math.sqrt(dot(a, a));
}

function rescale(a, l) {
    var na = norm(a);
    return {
        x: a.x / na * l,
        y: a.y / na * l
    };
}

function sum(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
}

function times(n, a) {
    return { x: n * a.x, y: n * a.y };
}


function offset2(a, b, w) {
    var dotab = dot(a, b);
    var norma = norm(a);
    var normb = norm(b);
    var cos2 = Math.pow(dotab / (norma * normb), 2);
    var targetNorm = w / Math.sqrt(1 - cos2);
    var va = rescale(a, targetNorm);
    var vb = rescale(b, targetNorm);

    return [
        sum(va, vb),
        sum(times(-1, va), vb),
        sum(va, times(-1, vb)),
        sum(times(-1, va), times(-1, vb))
    ];
}

function offset(arr, w) {
    var pairwise = [];
    for (var i = 0; i < arr.length; i++)
        for (var j = 0; j < i; j++)
            pairwise = pairwise.concat(offset2(arr[i], arr[j], w));
    return conv(pairwise);
}

var nodes = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 }
];
var edges = [
    [0, 1],
    [1, 2],
    [2, 0]
];
var w = 1;

var nodeVecs = nodes.map((pos, i) => {
    return edges.reduce((acc, ij) => {
        var side = ij.indexOf(i);
        if (side !== -1)
            acc.push(sum(nodes[ij[1 - side]], times(-1, nodes[ij[side]])))
        return acc;
    }, []);
})
console.log(nodeVecs)

console.log(offset(nodeVecs[0], w));
