(function() {
    var canvas = document.getElementById("pentagons");
    var context = canvas.getContext('2d');

    canvas.height = canvas.style.height = 1000;
    canvas.width = canvas.style.width = 1000;

    context.lineWidth = 0.1;

    function drawPentagon(points) {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        var x0 = points[0].x;
        var y0 = points[0].y;
        var min = Infinity;
        var max = 0;
        for(var i = 0; i <= 5; i++) {
            var x = points[i % 5].x;
            var y = points[i % 5].y;
            var dx = x - x0;
            var dy = y - y0;
            var dd = dx * dx + dy * dy;
            if(i) {
                if(dd < min) min = dd;
                if(dd > max) max = dd;
            }
            context.lineTo(x, y);
            x0 = x;
            y0 = y;
        }
        context.closePath();
        if(max / min < 500) {
            context.stroke();
        }
    }

    function getFirstPentagon() {
        var center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        var radius = Math.min(canvas.height, canvas.width) / 2;
        var points = [];
        for(var i = 0; i < 5; i++) {
            points[i] = {
                x: center.x + Math.sin(Math.PI * 0.4 * i + 0.0001) * radius,
                y: center.y - Math.cos(Math.PI * 0.4 * i + 0.0001) * radius
            };
        }
        return points;
    }

    function getIntercept(p1, p2, p3, p4) {
        var slope1 = (p2.y - p1.y) / (p2.x - p1.x);
        var slope2 = (p4.y - p3.y) / (p4.x - p3.x);
        var intercept1 = p1.y - (slope1 * p1.x);
        var intercept2 = p3.y - (slope2 * p3.x);
        if(slope1 == slope2) {
            return false;
        } if(slope1 == Infinity || slope1 == -Infinity) {
            var x = p1.x;
            var y = intercept2 + slope2 * x;
            return {x: x, y: y};
        } else if(slope2 == Infinity || slope2 == -Infinity) {
            var x = p3.x;
            var y = intercept1 + slope1 * x;
            return {x: x, y: y};
        } else if(isNaN(slope1) || isNaN(slope2)) {
            return false;
        } else {
            var x = (intercept1 - intercept2) / (slope2 - slope1);
            var y = intercept1 + slope1 * x;
            return {x: x, y: y};
        }
    }

    function getMidpoint(p1, p2) {
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        }
    }

    function getChildPentagons(ppent) {
        var pentagons = [];
        var cpent = [];
        for(var i = 0; i < 5; i++) {
            var pentagon = [];
            pentagon.push(ppent[i]);
            var j = (i + 1) % 5;
            var k = (i + 2) % 5;
            var l = (i + 3) % 5;
            var m = (i + 4) % 5;
            pentagon.push(getMidpoint(ppent[i], ppent[j]));
            cpent.push(getIntercept(ppent[i], ppent[k], ppent[j], ppent[m]));
            pentagon.push(getIntercept(ppent[i], ppent[k], ppent[j], ppent[m]));
            pentagon.push(getIntercept(ppent[i], ppent[l], ppent[j], ppent[m]));
            pentagon.push(getMidpoint(ppent[i], ppent[m]));
            pentagons.push(pentagon);
        }
        pentagons.push(cpent);
        return pentagons;
    }

    function draw_r(pentagon, r) {
        drawPentagon(pentagon);
        if(r == 0) {
            return;
        } else {
            var children = getChildPentagons(pentagon);
            for(var i = 0; i < children.length; i++) {
                draw_r(children[i], r - 1);
            }
        }
    }

    window.addEventListener('load', function() {
        draw_r(getFirstPentagon(), 7);
    });
})()
