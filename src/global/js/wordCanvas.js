 var writeWordFun =(function(){
     var canvasW =  600,canvasH = 600;
     var canvasWord = document.getElementById('wordCanvas');
     var wordContext = canvasWord.getContext('2d');
     canvasWord.width = canvasW;
     canvasWord.height = canvasH;
     var mouseDown = false;
     var lastPos = {x:0,y:0} ;
     var lastTime = 0;
     var lastLineW = -1;


     var drawRiceGrid = function(){
         wordContext.save();
         wordContext.strokeStyle = 'red';
         var gapN = 2;
         wordContext.beginPath();
         wordContext.moveTo(gapN,gapN);
         wordContext.lineTo(canvasW-gapN,gapN);
         wordContext.lineTo(canvasW-gapN,canvasH-gapN);
         wordContext.lineTo(gapN,canvasH-gapN);
         wordContext.closePath();
         wordContext.lineWidth = 6;

         wordContext.stroke();

         wordContext.beginPath();
         wordContext.moveTo(0,0);
         wordContext.lineTo(canvasW,canvasH);

         wordContext.moveTo(canvasW,0);
         wordContext.lineTo(0,canvasW);

         wordContext.moveTo(canvasW/2,0);
         wordContext.lineTo(canvasW/2,canvasH);

         wordContext.moveTo(0,canvasH/2);
         wordContext.lineTo(canvasW,canvasH/2);

         wordContext.lineWidth = 1;
         wordContext.stroke();

         wordContext.restore();

     }
     var getEleViewPos = function (x,y) {
          var elePos = canvasWord.getBoundingClientRect();
         return{
             x:Math.round(x-elePos.left),
             y:Math.round(y-elePos.top)
         }
     }
     var minV = 0.1,maxV= 10;
     var minLineW = 1,maxLineW = 20;

     var getLineWidth = function (s,t) {
         var v = s/t;
         var outLineW;
         if(v<=minV){
             outLineW = maxLineW;
         }
         else if(v>=maxV){
             outLineW = minLineW;
         }
         else{
             outLineW = maxLineW - (v-minV)/(maxV - minV)*(maxLineW - minLineW);
         }

         if(lastLineW == -1){
             return outLineW;
         }
         return (outLineW*1/3 + lastLineW*2/3);
     }
     var writeWord = function(){
         var downEvent = function(){

         }
         canvasWord.onmousedown = function (e) {
             mouseDown = true;
             lastPos = getEleViewPos(e.clientX,e.clientY);
             lastTime = new Date().getTime();
         }
         canvasWord.onmousemove = function (e) {
             var currentPos = getEleViewPos(e.clientX,e.clientY);
             var currentTime = new Date().getTime();
             var t = currentTime -lastTime;
             var s = Math.sqrt((currentPos.x-lastPos.x)*(currentPos.x-lastPos.x) + (currentPos.y-lastPos.y) * (currentPos.y-lastPos.y));
             var lineWith = getLineWidth(s,t);

             if(mouseDown){
                 wordContext.beginPath();
                 wordContext.strokeStyle = 'black';
                 wordContext.lineWidth = lineWith;
                 wordContext.moveTo(lastPos.x,lastPos.y);
                 wordContext.lineTo(currentPos.x,currentPos.y);
                 wordContext.lineCap = 'round';
                 wordContext.lineJoin = 'round';
                 wordContext.stroke();

                 lastPos = currentPos;
                 lastTime = currentTime;
                 lastLineW = lineWith;
             }




         } ;
         canvasWord.onmouseup = function (e) {
             mouseDown = false;
         }
         canvasWord.onmouseout = function (e) {
             mouseDown = false;
         }
     }

     return{
         initGrid:function () {
             drawRiceGrid();
             writeWord();
         }
     }
 })();

 writeWordFun.initGrid();





