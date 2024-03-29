var canvas;
        var canvasContext;
        var ballX = 50;
        var ballY = 50;
        var ballSpeedX = 10;
        var ballSpeedY = 4;

        var player1Score = 0;
        var player2Score = 0;
        const WINNING_SCORE = 3;

        var showingWinScreen = false;

        var paddle1Y = 250;
        var paddle2Y = 250;
        const PADDLE_HEIGHT = 100;
        const PADDLE_THICKNESS = 10;

        function calculateMousePos(evt) {
            var rect = canvas.getBoundingClientRect();
            var root = document.documentElement;
            var mouseX = evt.clientX - rect.left - root.scrollLeft;
            var mouseY = evt.clientY - rect.top - root.scrollTop;
            return {
                x:mouseX,
                y:mouseY
            }
        }
        
        function handleMouseClick(evt){
            if(showingWinScreen) {
                player1Score = 0;
                player2Score = 0;
                showingWinScreen = false;
            }
        }

        window.onload = function() { 
            console.log("hello world");
            canvas = document.getElementById('gameCanvas');
            canvasContext = canvas.getContext('2d');

            var framesPerSecond = 30;
            setInterval(function(){
                moveEverything();
                drawEverything();
            }, 1000/framesPerSecond);

            canvas.addEventListener('mousedown', handleMouseClick)

            canvas.addEventListener('mousemove', 
                function(evt){
                    var mousePos = calculateMousePos(evt);
                    paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
                })
        }
        function ballReset(){
            if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
                showingWinScreen = true;
            }
            ballX = canvas.width/2;
            ballY = canvas.height/2;
            ballSpeedX = -ballSpeedX;
        }

        function computerMovement(){
            var paddle2YCentre = paddle2Y + (PADDLE_HEIGHT/2);
            if(paddle2YCentre < ballY-35) {
                paddle2Y += 6;
            } else if(paddle2YCentre > ballY+35){
                paddle2Y -= 6;
            }
        }

        function moveEverything(){
            if(showingWinScreen) {
                return;
            }
            computerMovement();

            ballX += ballSpeedX;
            ballY += ballSpeedY;

            if(ballX < 0) {
                if((ballY > paddle1Y) && (ballY < paddle1Y + PADDLE_HEIGHT)){
                    ballSpeedX = -ballSpeedX;
                    
                    var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
                    ballSpeedY = deltaY * 0.35;
                } else {
                    player2Score++; // must be before ballReset()
                    ballReset();
                }
            }
            if(ballX > canvas.width) {
                if((ballY > paddle2Y) && (ballY < paddle2Y + PADDLE_HEIGHT)){
                    ballSpeedX = -ballSpeedX;

                    var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
                    ballSpeedY = deltaY * 0.35;
                } else {
                    player1Score++;
                    ballReset();
                }
            }
            if(ballY < 0) {
                ballSpeedY = -ballSpeedY;
            }
            if(ballY > canvas.height) {
                ballSpeedY = -ballSpeedY;
            }
        }

        function drawNet() {
            for(var i = 0; i<canvas.height; i+=40){
                colourRect(canvas.width/2-1,i, 2, 20, 'white');
            }
        }

        function drawEverything() {
            // black screen
            colourRect(0, 0, canvas.width, canvas.height, 'black');

            if(showingWinScreen) {
                canvasContext.fillStyle = 'white';
                if(player1Score >= WINNING_SCORE){
                    canvasContext.fillText("left player won", 350, 200);
                } else if (player2Score >= WINNING_SCORE) {
                    canvasContext.fillText("right player won", 350, 200);
                }
                canvasContext.fillText("click to continue", 350, 500);
                return;
            }
            drawNet();
            // left player paddle
            colourRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
            // right computer paddle
            colourRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
            // ball
            colourCircle(ballX, ballY, 10, 'white');
            
            canvasContext.fillText(player1Score, 100, 100);
            canvasContext.fillText(player2Score, canvas.width-100, 100);
        }
        function colourCircle(centreX, centreY, radius, drawColour){
            canvasContext.fillStyle = drawColour;
            canvasContext.beginPath();
            canvasContext.arc(centreX, centreY, radius, 0, Math.PI*2, true);
            canvasContext.fill();
        }

        function colourRect(leftX, topY, width, height, drawColour){
            canvasContext.fillStyle = drawColour;
            canvasContext.fillRect(leftX, topY, width, height);
        }