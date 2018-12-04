$(function() {
    $('#canvas-div').css({
        'height': window.innerHeight - 267
    });

    var canvas;
    var context;
    var canvasWidth = $('#canvas-div').width();
    var canvasHeight = $('#canvas-div').height();
    var clickX = [];
    var clickY = [];
    var clickColor = [];
    var clickTool = [];
    var clickSize = [];
    var clickDrag = [];
    var paint = false;
    var curColor = '#000000';
    var curTool = "crayon";
    var curSize = "normal";
    var fileName = '';

    prepareCanvas();

    /**
    * Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
    */
    function prepareCanvas()
    {
        var canvasDiv = document.getElementById('canvas-div');
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', canvasWidth);
        canvas.setAttribute('height', canvasHeight);
        canvas.setAttribute('id', 'canvas');
        canvasDiv.appendChild(canvas);
        if(typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        context = canvas.getContext("2d");

        $('#canvas')
            .mousedown(function(e){
                paint = true;
                addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
                redraw();
            })
            .mousemove(function(e){
                if(paint){
                    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
                    redraw();
                }
            })
            .mouseup(function(e){
                paint = false;
            })
            .mouseleave(function(e){
                paint = false;
            });

        $('#canvas')
            .on('touchstart', function (e) {
                paint = true;
                var touch = e.touches[0];
                addClick(touch.pageX - this.offsetLeft, touch.pageY - this.offsetTop);
                redraw();
            })
            .on('touchmove', function (e) {
                e.preventDefault();
                if (paint) {
                    var touch = e.touches[0];
                    addClick(touch.pageX - this.offsetLeft, touch.pageY - this.offsetTop, true);
                    redraw();
                }
            })
            .on('touchend', function (e) {
                paint = false;
            });

        $('nav a').click(function () {
            var obj = $(this);
            if (obj.hasClass('clear')) {
                clearCanvas();
                clickX = [];
                clickY = [];
                clickTool = [];
                clickColor = [];
                clickSize = [];
                clickDrag = [];
            } else if (obj.hasClass('save')) {
                var imageUrl = canvas.toDataURL();

                $('#output-image').html('');
                $('<img>').attr('src', imageUrl).addClass('img-responsive').appendTo('#output-image');

                // $.ajax({
                //     url: 'draw.php',
                //     method: "POST",
                //     data: {
                //         'image': imageUrl,
                //         'fileName': fileName
                //     }
                // }).done(function (result) {
                //     fileName = result;
                // });
            } else if (obj.hasClass('color')) {
                curColor = obj.data('color');

                $('#current-pen-style').css('background', obj.data('color'));
            } else if (obj.hasClass('size')) {
                curSize = obj.data('size');

                if(obj.data('size') == "small"){
                    radius = 2;
                }else if(obj.data('size') == "large"){
                    radius = 10;
                }else if(obj.data('size') == "huge"){
                    radius = 20;
                }else{
                    radius = 5;
                }
                $('#current-pen-style').css({
                    'height': radius + 'px',
                    'width': radius + 'px'
                });
            } else if (obj.hasClass('tool')) {
                curTool = obj.data('tool');
            }
        });

        $(window).on('beforeunload', function(){
            // 聽說這個自訂訊息因為怕人家詐騙所以沒用了
            return '你確定要離開嗎？';
        });
    }

    /**
     * Adds a point to the drawing array.
     * @param x
     * @param y
     * @param dragging
     */
    function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
        clickTool.push(curTool);
        if(curTool == "eraser"){
            clickColor.push("white");
        }else{
            clickColor.push(curColor);
        }
        clickSize.push(curSize);
    }

    /**
     * Clears the canvas.
     */
    function clearCanvas()
    {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    /**
     * Redraws the canvas.
     */
    function redraw(){
        clearCanvas();

        context.lineJoin = "round";

        for(var i=0; i < clickX.length; i++) {
            if(clickSize[i] == "small"){
                radius = 2;
            }else if(clickSize[i] == "large"){
                radius = 10;
            }else if(clickSize[i] == "huge"){
                radius = 20;
            }else{
                radius = 5;
            }

            context.beginPath();
            if(clickDrag[i] && i){
                context.moveTo(clickX[i-1], clickY[i-1]);
            }else{
                context.moveTo(clickX[i]-1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.strokeStyle = clickColor[i];
            context.lineWidth = radius;
            context.stroke();
        }
    }
});