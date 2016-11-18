window.onload = function () {
    function getElementLeft(ele) {
        var actualLeft = ele.offsetLeft;
        var current = ele.offsetParent;
        while (current != null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    }
    function getElementTop(ele) {
        var actualTop = ele.offsetTop;
        var current = ele.offsetParent;
        while (current != null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    }
    var guaguale = function () {
        var outBox = document.getElementById("canvasOuter");
        var outBoxStyle = document.defaultView.getComputedStyle(outBox, null);
        //alert(X);
        var myCanvas = document.getElementById("myCanvas");
        myCanvas.style.height = outBoxStyle.height;
        myCanvas.style.width = outBoxStyle.width;
        var can = myCanvas.getContext("2d");
        var X = myCanvas.width;
        var Y = myCanvas.height;
        var oImg = new Image();
        oImg.src = "/global/images/guagua/gao4.jpeg";
        oImg.onload = function () {
            can.beginPath();
            can.drawImage(oImg, 0, 0, X, Y);
            can.closePath();
        };
        var device = /android|iphone|ipad|ipod|webos|iemobile|opear mini|linux/i.test(navigator.userAgent.toLowerCase());
        var startEvtName = device ? "touchstart" : "mousedown";
        var moveEvtName = device ? "touchmove" : "mousemove";
        var endEvtName = device ? "touchend" : "mouseup";
        function getElementLeft(ele) {
            var actualLeft = ele.offsetLeft;
            var current = ele.offsetParent;
            while (current != null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
            return actualLeft;
        }
        function getElementTop(ele) {
            var actualTop = ele.offsetTop;
            var current = ele.offsetParent;
            while (current != null) {
                actualTop += current.offsetTop;
                current = current.offsetParent;
            }
            return actualTop;
        }
        function draw(event) {
            //console.log(getElementLeft(myCanvas));
            var canvasTop = getElementTop(myCanvas) - document.documentElement.scrollTop;
            var canvasLeft = getElementLeft(myCanvas) - document.documentElement.scrollLeft;
            var x = device ? event.touches[0].clientX : event.clientX;
            var y = device ? event.touches[0].clientY : event.clientY;
            var newX = x - canvasLeft;
            var newY = y - canvasTop;
            console.log(newX);
            //console.log(x,y);
            can.beginPath();
            can.globalCompositeOperation = "destination-out";
            can.arc(newX, newY, 10, 0, Math.PI * 2, false);
            can.fill();
            can.closePath();
        }
        //true  捕获 false  冒泡
        myCanvas.addEventListener(startEvtName, function () {
            myCanvas.addEventListener(moveEvtName, draw, false);
        }, false);
        myCanvas.addEventListener(endEvtName, function () {
            myCanvas.removeEventListener(moveEvtName, draw, false);
        }, false);
    };

    // guaguale();

    (function (bodyStyle) {
        bodyStyle.mozUserSelect = 'none';
        bodyStyle.webkitUserSelect = 'none';
        var img = new Image();
        var canvas = document.querySelector('canvas');
        var canvasOuter = document.getElementById("canvasOuter");
        canvas.style.backgroundColor = 'transparent';
        canvas.style.position = 'absolute';
        var computerStyle = document.defaultView.getComputedStyle(canvasOuter, null);

        img.addEventListener('load', function (e) {
            var ctx;
            var w = computerStyle.width.replace('px', ''),
                h = computerStyle.height.replace('px', '');
            //console.log(w);
            var mousedown = false;
            function layer(ctx) {
                ctx.fillStyle = 'gray';
                ctx.fillRect(0, 0, w, h);
            }
            function eventDown(e) {
                e.preventDefault();
                mousedown = true;
            }
            function eventUp(e) {
                e.preventDefault();
                mousedown = false;
            }
            function eventMove(e) {
                e.preventDefault();
                if (mousedown) {
                    if (e.changedTouches) {
                        e = e.changedTouches[e.changedTouches.length - 1];
                    }

                    var x = e.clientX - offsetPos(canvas).left;
                    var y = e.clientY - offsetPos(canvas).top;
                    ctx.beginPath();
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.arc(x, y, 20, 0, Math.PI * 2, false);
                    ctx.fill();
                    //ctx.closePath();
                }
            }
            function offsetPos(ele) {
                var pos = ele.getBoundingClientRect();
                return {
                    left: pos.left,
                    top: pos.top
                };
            }
            canvas.width = w;
            canvas.height = h;
            canvas.style.backgroundImage = 'url(' + img.src + ')';
            ctx = canvas.getContext('2d');
            ctx.fillStyle = 'transparent';
            ctx.fillRect(0, 0, w, h);
            layer(ctx);
            canvas.addEventListener('touchstart', eventDown);
            canvas.addEventListener('touchend', eventUp);
            canvas.addEventListener('touchmove', eventMove);
            canvas.addEventListener('mousedown', eventDown);
            canvas.addEventListener('mouseup', eventUp);
            canvas.addEventListener('mouseout', eventUp);
            canvas.addEventListener('mousemove', eventMove);
        });

        img.src = 'http://www.baidu.com/img/bdlogo.gif';
    })(document.body.style);
};