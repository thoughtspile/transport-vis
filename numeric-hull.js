<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
        <style media="screen">
            svg .walk {
                fill: orange;
                stroke: none;
            }
            svg .center {
                fill: red;
                stroke: none;
            }

            svg .inter {
                fill: none;
                stroke: red;
            }
            svg .outer {
                fill: none;
                stroke: red;
                opacity: .15;
            }
        </style>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" media="screen" >
    </head>
    <body class='container'>
        <svg class='drawing'></svg>

        <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
        <script src="vec.js" charset="utf-8"></script>
        <script src="https://d3js.org/d3-voronoi.v0.2.min.js"></script>
        <!-- <script src="node_modules/voronoi/rhill-voronoi-core.js" charset="utf-8"></script> -->
        <script>
            var distMax = 20;
            var count = 400;
            var w = 900;
            var h = 600;

            var centers = [];
            for (var i = 0; i < count; i++)
                centers.push([Math.random() * w, Math.random() * h]);

            var edgesIn = [];
            var edgesOut = [];
            for (var i = 0; i < count; i++) {
                for (var j = 0; j < i; j++) {
                    var d = dist(centers[i], centers[j]);
                    centers[i].clust = i;
                    if (d >= 2 * distMax) {
                        continue;
                    }
                    var target = null;
                    if (d < distMax) {
                        centers[i].clust = centers[j].clust;
                        target = edgesIn;
                    } else if (d < 2 * distMax) {
                        target = edgesOut;
                    }
                    target.push([centers[i], centers[j]]);
                }
            }

            function getDegree(node, edges) {
                return edges.filter(function(nodes) {
                    return nodes.indexOf(node) >= 0;
                }).length;
            }

            function hasEdge(edge, edges) {
                for (var i = 0; i < edges.length; i++)
                    if (edges[i].indexOf(edge[0]) !== -1 && edges[i].indexOf(edge[1]) !== -1)
                        return true;
                return false;
            }

            function getCluster(pt, nodes) {
                for (var i = 0; i < nodes.length; i++)
                    if (pt[0] == nodes[i][0] && pt[1] == nodes[i][1])
                        return i.clust;
            }

            var poles = [];
            var poles = d3_voronoi.voronoi()
                .extent([[0, 0], [w, h]])
                (centers)
                .edges
                .filter(function(edge) {
                    // not a correct inter-cluster restriction
                    return edge.left && edge.right &&
                        getCluster(edge.left, centers) == getCluster(edge.right, centers);
                })
                .filter(function(edge) {
                    return dist(edge[0], edge.left) > distMax ||
                        dist(edge[1], edge.left) > distMax;
                })
                .filter(function(edge) {
                    var a = edge[0];
                    var n = rescale(sub(edge[1], edge[0]), 1);
                    var diffL = sub(a, edge.left);
                    var diffR = sub(a, edge.right);
                    return dist(diffL, times(dot(diffL, n), n), edge.left) < distMax ||
                        dist(diffR, times(dot(diffR, n), n), edge.right) < distMax;
                })
                .map(edge => {
                    var inter = times(.5, sum(edge.left, edge.right));
                    var d = dist(edge.left, edge.right);
                    var offset = Math.sqrt(distMax * distMax - d * d / 4);
                    var mv = rescale(sub(edge[1], edge[0]), offset);
                    edge[0] = dist(edge[0], edge.left) > distMax
                        ? sub(inter, mv)
                        : inter;
                    edge[1] = dist(edge[1], edge.left) > distMax
                        ? sum(inter, mv)
                        : inter;
                    return edge;
                });

            // edgesIn.forEach(function(edge) {
            //     var d = norm(sub(edge[1], edge[0]));
            //     var offset = Math.sqrt(distMax * distMax - d * d / 4);
            //     var half = times(.5, sub(edge[1], edge[0]));
            //     var normal = [-half[1], half[0]];
            //     var goodNormal = rescale(normal, offset);
            //     var mid = times(.5, sum(edge[1], edge[0]));
            //
            //     var common = centers.filter(function(node) {
            //         return hasEdge([node, edge[0]], edgesIn) && hasEdge([node, edge[1]], edgesIn);
            //     }).map(node => sub(node, mid));
            //
            //     if (common.every(v => dot(goodNormal, v) <= 0))
            //         poles.push([mid, sum(mid, goodNormal)]);
            //     if (common.every(v => dot(goodNormal, v) >= 0))
            //         poles.push([mid, sub(mid, goodNormal)]);
            // });
            //
            // centers.forEach(function(node, i) {
            //     node.degree = getDegree(node, edgesIn);
            // });
            //
            // poles = poles.concat(centers.reduce((acc, node) => {
            //     if (node.degree == 0)
            //         return acc;
            //
            //     var superpos = edgesIn.reduce((acc, edge) => {
            //         var pos = edge.indexOf(node);
            //         if (pos !== -1)
            //             acc = sum(acc, rescale(sub(node, edge[1 - pos]), 1));
            //         return acc;
            //     }, [0, 0]);
            //     var pole = rescale(superpos, distMax);
            //     acc.push([node, sum(node, pole)]);
            //
            //     return acc;
            // }, []));

            // exposed: has degree over 120 between consecutive edges
            // only use inter-cluster voronoi edges


            var enter = d3.select('.drawing')
                .attr('width', w)
                .attr('height', h)
                .selectAll('circle')
                .data(centers)
                .enter();
            enter.append('circle')
                .attr('class', 'walk')
                .attr('cx', d => d[0])
                .attr('cy', d => d[1])
                .attr('r', distMax)
            enter.append('circle')
                .attr('class', 'center')
                .attr('cx', d => d[0])
                .attr('cy', d => d[1])
                .attr('r', 0)

            d3.select('.drawing')
                .selectAll('.inter')
                .data(edgesIn)
                .enter()
                    .append('line')
                    .attr('x1', d => d[0][0])
                    .attr('y1', d => d[0][1])
                    .attr('x2', d => d[1][0])
                    .attr('y2', d => d[1][1])
                    .attr('class', 'inter')
            d3.select('.drawing')
                .selectAll('.outer')
                .data([])//edgesOut)
                .enter()
                    .append('line')
                    .attr('class', 'outer')
                    .attr('x1', d => d[0][0])
                    .attr('y1', d => d[0][1])
                    .attr('x2', d => d[1][0])
                    .attr('y2', d => d[1][1]);
            d3.select('.drawing')
                .selectAll('.poles')
                .data(poles)
                .enter()
                    .append('line')
                    .attr('class', 'poles')
                    .attr('stroke', 'green')
                    .attr('x1', d => d[0][0])
                    .attr('y1', d => d[0][1])
                    .attr('x2', d => d[1][0])
                    .attr('y2', d => d[1][1]);


        </script>
    </body>
</html>
