var writeWordFun = function () {
    var canvasWidth = Math.min(800, document.documentElement.clientWidth - 20);
    var canvasW = canvasWidth,
        canvasH = canvasWidth;
    var canvasWord = document.getElementById('wordCanvas');
    var wordContext = canvasWord.getContext('2d');
    canvasWord.width = canvasW;
    canvasWord.height = canvasH;
    var mouseDown = false;
    var lastPos = { x: 0, y: 0 };
    var lastTime = 0;
    var lastLineW = -1;

    var drawRiceGrid = function () {
        wordContext.save();
        wordContext.strokeStyle = 'red';
        var gapN = 2;
        wordContext.beginPath();
        wordContext.moveTo(gapN, gapN);
        wordContext.lineTo(canvasW - gapN, gapN);
        wordContext.lineTo(canvasW - gapN, canvasH - gapN);
        wordContext.lineTo(gapN, canvasH - gapN);
        wordContext.closePath();
        wordContext.lineWidth = 6;

        wordContext.stroke();

        wordContext.beginPath();
        wordContext.moveTo(0, 0);
        wordContext.lineTo(canvasW, canvasH);

        wordContext.moveTo(canvasW, 0);
        wordContext.lineTo(0, canvasW);

        wordContext.moveTo(canvasW / 2, 0);
        wordContext.lineTo(canvasW / 2, canvasH);

        wordContext.moveTo(0, canvasH / 2);
        wordContext.lineTo(canvasW, canvasH / 2);

        wordContext.lineWidth = 1;
        wordContext.stroke();

        wordContext.restore();
    };
    var getEleViewPos = function (x, y) {
        var elePos = canvasWord.getBoundingClientRect();
        return {
            x: Math.round(x - elePos.left),
            y: Math.round(y - elePos.top)
        };
    };
    var minV = 0.1,
        maxV = 10;
    var minLineW = 0.1,
        maxLineW = 10;

    var getLineWidth = function (s, t) {
        var v = s / t;
        var outLineW;
        if (v <= minV) {
            outLineW = maxLineW;
        } else if (v >= maxV) {
            outLineW = minLineW;
        } else {
            outLineW = maxLineW - (v - minV) / (maxV - minV) * (maxLineW - minLineW);
        }

        if (lastLineW == -1) {
            return outLineW;
        }
        return outLineW * 1 / 3 + lastLineW * 2 / 3;
    };
    var writeWord = function () {
        var downEvent = function (point) {
            mouseDown = true;
            lastPos = getEleViewPos(point.x, point.y);
            lastTime = new Date().getTime();
        };
        var upEvent = function () {
            mouseDown = false;
        };
        var moveEvent = function (point) {
            if (mouseDown) {
                var currentPos = getEleViewPos(point.x, point.y);
                var currentTime = new Date().getTime();
                var t = currentTime - lastTime;
                var s = Math.sqrt((currentPos.x - lastPos.x) * (currentPos.x - lastPos.x) + (currentPos.y - lastPos.y) * (currentPos.y - lastPos.y));
                var lineWith = getLineWidth(s, t);

                wordContext.beginPath();
                wordContext.strokeStyle = 'black';
                wordContext.lineWidth = lineWith;
                wordContext.moveTo(lastPos.x, lastPos.y);
                wordContext.lineTo(currentPos.x, currentPos.y);
                wordContext.lineCap = 'round';
                wordContext.lineJoin = 'round';
                wordContext.stroke();

                lastPos = currentPos;
                lastTime = currentTime;
                lastLineW = lineWith;
            }
        };

        canvasWord.addEventListener('mousedown', function (e) {
            e.preventDefault();
            downEvent({ x: e.clientX, y: e.clientY });
        }, false);
        canvasWord.addEventListener('mouseup', function (e) {
            e.preventDefault();
            upEvent();
        }, false);
        canvasWord.addEventListener('mouseout', function (e) {
            e.preventDefault();
            upEvent();
        }, false);
        canvasWord.addEventListener('mousemove', function (e) {
            e.preventDefault();
            moveEvent({ x: e.clientX, y: e.clientY });
        }, false);
        canvasWord.addEventListener('touchstart', function (e) {
            e.preventDefault();
            var touch = e.touches[0];
            downEvent({ x: touch.pageX, y: touch.pageY });
        }, false);
        canvasWord.addEventListener('touchmove', function (e) {
            e.preventDefault();
            var touch = e.touches[0];
            moveEvent({ x: touch.pageX, y: touch.pageY });
        }, false);
        canvasWord.addEventListener('touchend', function (e) {
            e.preventDefault();
            upEvent();
        }, false);
    };
    var cleatEvent = function () {
        var clearBtn = document.getElementById("clearBtn");
        var clearFun = function () {
            wordContext.clearRect(0, 0, canvasW, canvasH);
            drawRiceGrid();
        };
        clearBtn.addEventListener("click", clearFun, false);
    };
    return {
        initGrid: function () {
            drawRiceGrid();
            writeWord();
            cleatEvent();
        }
    };
}();

writeWordFun.initGrid();