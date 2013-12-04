(function() {
    //rhombus Class 
    var Rhombus = function() {
        this.context;
        this.drawGraph;
        this.drawPoint;
        this.point;
        this.drawLine;
        this.closeLine;
        this.createAngle;
        this.getAngle;
        this.canvasText;
        this.pointArray = new Array();
        this.newAngle = new Array();
    }
    //Declaring ID
    var id = {
    canvas: "#canvas",
    clear:"#clear"
    
    }
    $(document).ready(function() {
        init();
    });
    init = function() {
        var canvas_id;
        $('audio').hide();
        var rhombus_obj = new Rhombus();
        canvas_id = $(id.canvas);
        rhombus_obj.context = canvas_id[0].getContext("2d");
        rhombus_obj.drawGraph();
        $(id.canvas).click(function() {
            rhombus_obj.drawPoint();
        });
        $(id.clear).click(function() {
            location.reload()
        });
    }
    //Declaring Constants
    var Point = function(x, y) {
        this.x = x;
        this.y = y;
    }
    var constants = {
        count: 0,
        undefined: "undefined",
        startPoint: 0,
        endPoint: 4,
        checkFirstTime: -1,
        textLong: 20,
        angle: 90,
        zero: 0,
        one: 1,
        two: 2,
        three: 3
    };
    //Declaring Sound
    var sound = {
        audioId: '#speech',
        src: 'src',
        rhombus: 'rhombus.mp3',
        square: 'square.mp3',
        notRhombus: 'not_rhombus.mp3'
    };
    //Declaring Text Style and color
    var textStyle = {
        graphColor: "#eee",
        lineColor: "blue",
        textFont: "20px Georgia"
    };
    //Declaring constants for drawing a graph
    var rhombus_Const = {
        boxWidthHeight: 20,
        origin: new Point(0, 0),
        end: new Point(500, 500)
    };
    //declare for getting first point
    var mouse = {
        x: -1,
        y: -1
    };
    //Function for Drawing a Graph
    Rhombus.prototype.drawGraph = function() {
        this.context.beginPath();
        this.context.strokeStyle = textStyle.graphColor;
        // Horizontal Lines 
        for (var ycount = rhombus_Const.origin.y; ycount <= rhombus_Const.end.y; ycount += rhombus_Const.boxWidthHeight) {
            this.context.moveTo(rhombus_Const.origin.y, ycount);
            this.context.lineTo(rhombus_Const.end.y, ycount);
            this.context.stroke();
        }
        // Vertical Lines 
        for (var xcount = rhombus_Const.origin.x; xcount <= rhombus_Const.end.x; xcount += rhombus_Const.boxWidthHeight) {
            this.context.moveTo(xcount, rhombus_Const.origin.x);
            this.context.lineTo(xcount, rhombus_Const.end.x);
            this.context.stroke();
        }
    }
    //Function for Drawing a Point
    Rhombus.prototype.drawPoint = function() {
        constants.count += constants.one;
        if (constants.count <= constants.endPoint) {
            var currentLeft = event.pageX - canvas.offsetLeft;
            var currentTop = event.pageY - canvas.offsetTop;
            var left = this.point(currentLeft);
            var top = this.point(currentTop);
            this.context.beginPath();
            this.context.strokeStyle = textStyle.lineColor;
            this.context.arc(left, top, constants.endPoint, constants.zero, constants.two * Math.PI);
            this.context.fillStyle = textStyle.lineColor;
            this.context.fill();
            this.context.stroke();
            this.drawLine(left, top);
            this.pointArray.push({ x: left, y: top });
            if (constants.count == constants.endPoint) {
                this.closeLine(left, top);
            }
        }
    }
    //function for moving the point to neartest intersecting point
    Rhombus.prototype.point = function(point) {
        var point1 = point % rhombus_Const.boxWidthHeight;
        var temp = rhombus_Const.boxWidthHeight - point1;
        if (point1 > (rhombus_Const.boxWidthHeight / constants.two)) {
            point = point + temp;
        }
        else {
            point = point - point1;
        }
        return point;
    }
    //function for draw a line between two points
    Rhombus.prototype.drawLine = function(x, y) {
        if (mouse.x !== constants.checkFirstTime && mouse.y !== constants.checkFirstTime) {
            this.context.beginPath();
            this.context.moveTo(mouse.x, mouse.y);
            this.context.lineTo(x, y);
            this.context.stroke();
            mouse.x = x;
            mouse.y = y;
        } else {
            mouse.x = x;
            mouse.y = y;
        }

    }
    //function for drawing the closing line for rhombus
    Rhombus.prototype.closeLine = function(x, y) {
        this.context.beginPath();
        this.context.moveTo(this.pointArray[constants.startPoint].x, this.pointArray[constants.startPoint].y);
        this.context.lineTo(x, y);
        this.context.stroke();
        this.createAngle();
        this.canvasText();
    }
    //Function to display the result
    Rhombus.prototype.canvasText = function() {
        this.context.font = textStyle.textFont;
        this.context.strokeText("A", this.pointArray[constants.zero].x - constants.textLong, this.pointArray[constants.zero].y);
        this.context.strokeText("B", this.pointArray[constants.one].x + constants.textLong, this.pointArray[constants.one].y);
        this.context.strokeText("C", this.pointArray[constants.two].x + constants.textLong, this.pointArray[constants.two].y);
        this.context.strokeText("D", this.pointArray[constants.three].x - constants.textLong, this.pointArray[constants.three].y);
        var total = this.newAngle[constants.zero] + this.newAngle[constants.one] + this.newAngle[constants.two] + this.newAngle[constants.three];
        var msg = "<p align='center'><br> Measure of A = " + this.newAngle[constants.three] +
        "<br>Measure of B = " + this.newAngle[constants.zero] +
        "<br>Measure of C = " + this.newAngle[constants.one] +
        "<br>Measure of D = " + this.newAngle[constants.two] +
        "<br><br>Total Measurement = " + total + "</p>";
        $("#right_content").append(msg);
        if (this.newAngle[constants.zero] === constants.angle && this.newAngle[constants.one] === constants.angle && this.newAngle[constants.two] === constants.angle && this.newAngle[constants.three] === constants.angle) {
            $(sound.audioId).attr(sound.src, sound.square);
        }
        else if (this.newAngle[constants.three] === this.newAngle[constants.one] && this.newAngle[constants.zero] === this.newAngle[constants.two]) {
            $(sound.audioId).attr(sound.src, sound.rhombus);
        }
        else {
            $(sound.audioId).attr(sound.src, sound.notRhombus);
        }
        $(sound.audioId).trigger('play');
    }
    //function for sending points for finding the angle
    Rhombus.prototype.createAngle = function() {
        var point1, point2, point3;
        for (var i = constants.one; i <= this.pointArray.length; i++) {
            point1 = new Point(this.pointArray[i - constants.one].x, this.pointArray[i - constants.one].y);
            if (typeof this.pointArray[i] === constants.undefined) {

                point2 = new Point(this.pointArray[constants.zero].x, this.pointArray[constants.zero].y);
                point3 = new Point(this.pointArray[constants.one].x, this.pointArray[constants.one].y);
            }
            else if (typeof this.pointArray[i + constants.one] === constants.undefined) {

                point2 = new Point(this.pointArray[i].x, this.pointArray[i].y);
                point3 = new Point(this.pointArray[constants.zero].x, this.pointArray[constants.zero].y);
            }
            else {
                point2 = new Point(this.pointArray[i].x, this.pointArray[i].y);
                point3 = new Point(this.pointArray[i + constants.one].x, this.pointArray[i + constants.one].y);
            }

            this.newAngle[i - constants.one] = this.getAngle(point1, point2, point3);
        }
    }
    //Finding Angle between Lines
    Rhombus.prototype.getAngle = function(p0, c, p1) {
        var lengthOfp0c = Math.sqrt(Math.pow(c.x - p0.x, constants.two) + Math.pow(c.y - p0.y, constants.two)); // p0->c (b)
        var lengthOfp1c = Math.sqrt(Math.pow(c.x - p1.x, constants.two) + Math.pow(c.y - p1.y, constants.two)); // p1->c (a)
        var lengthOfp0p1 = Math.sqrt(Math.pow(p1.x - p0.x, constants.two) + Math.pow(p1.y - p0.y, constants.two)); // p0->p1 (c)
        return Math.round(Math.acos((Math.pow(lengthOfp1c, constants.two) + Math.pow(lengthOfp0c, constants.two) - Math.pow(lengthOfp0p1, constants.two)) / (constants.two * lengthOfp1c * lengthOfp0c)) * 180 / Math.PI); // put pow

    }

})();
