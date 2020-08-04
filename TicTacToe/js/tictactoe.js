let activePlayer = 'X';         //keeps track of who's turn it is
let selectedSquares = [];       //stores array of moves, determines win conditions

function placeXorO(squareNumber) {      //places an X or O in a square
    if (!selectedSquares.some(element => element.includes(squareNumber))) {     //ensures square hasnt been selected already
                                                                                //some() checks each element of selectedSquare to see if it contains the square number clicked on
        let select = document.getElementById(squareNumber);                     //retrieves html element id that was clicked
        if (activePlayer === 'X') {                                             //checks who's turn it is
            select.style.backgroundImage = 'url("imgs/x.png")';                 //if activePlayer is X, x.png is placed
        } else {                                                                //activePlayer may only be X or O
            select.style.backgroundImage = 'url("imgs/o.png")';                 //if activePlayer is O, o.png is placed
        }
        selectedSquares.push(squareNumber + activePlayer);              //squareNumber and activePlayer are concatenated and added to array
        checkWinConditions();                                           //calls function to check for any win conditions
        if (activePlayer === 'X') {                                     //this condition is for changing the active player
            activePlayer = 'O';
        } else {
            activePlayer = 'X';
        }

        audio('./media/place.mp3');                                 //plays placement sound
        if(activePlayer === 'O'){                                   //checks to see if it's computers turn
            disableClick();                                         //disables clicking for computer choice
            setTimeout(function (){ computersTurn(); }, 1000);      //function waits 1 second before placing image and enabling click
        }
        return true;                                                //needed for computersTurn() to work
    }

    function computersTurn() {                                          //results in random square being selected
        let success = false;                                            //boolean needed for while loop
        let pickASquare;                                                //variable stores random number 0-8
        while(!success) {                                               //allows while loop to keep trying if a square is already selected
            pickASquare = String(Math.floor(Math.random() * 9));        //random number between 0-8 is selected
            if (placeXorO(pickASquare)){                                //if the random number returns true, the square hasnt been selected
                placeXorO(pickASquare);                                 //calls the function
                success=true;                                           //changes the boolean and ends loop
            };
        }
    }
}



function checkWinConditions() {     //parses the selectedSquares array to search for win conditions, drawWinLine function is called to draw line if condition is met
    if      (arrayIncludes('0X', '1X', '2X')) { drawWinLine(50, 100, 558, 100); } //X 0,1,2 condition
    else if (arrayIncludes('3X', '4X', '5X')) { drawWinLine(50, 304, 558, 304); } //X 3,4,5 condition
    else if (arrayIncludes('6X', '7X', '8X')) { drawWinLine(50, 508, 558, 508); } //X 6,7,8 condition
    else if (arrayIncludes('0X', '3X', '6X')) { drawWinLine(100, 50, 100, 558); } //X 0,3,6 condition
    else if (arrayIncludes('1X', '4X', '7X')) { drawWinLine(304, 50, 304, 558); } //X 1,4,7 condition
    else if (arrayIncludes('2X', '5X', '8X')) { drawWinLine(508, 50, 508, 558); } //X 2,5,8 condition
    else if (arrayIncludes('6X', '4X', '2X')) { drawWinLine(100, 508, 510, 90); } //X 6,4,2 condition
    else if (arrayIncludes('0X', '4X', '8X')) { drawWinLine(100, 100, 520, 520); } //X 0,4,8 condition
    else if (arrayIncludes('0O', '1O', '2O')) { drawWinLine(50, 100, 558, 100); } //O 0,1,2 condition
    else if (arrayIncludes('3O', '4O', '5O')) { drawWinLine(50, 304, 558, 304); } //O 3,4,5 condition
    else if (arrayIncludes('6O', '7O', '8O')) { drawWinLine(50, 508, 558, 508); } //O 6,7,8 condition
    else if (arrayIncludes('0O', '3O', '6O')) { drawWinLine(100, 50, 100, 558); } //O 0,3,6 condition
    else if (arrayIncludes('1O', '4O', '7O')) { drawWinLine(304, 50, 304, 558); } //O 1,4,7 condition
    else if (arrayIncludes('2O', '5O', '8O')) { drawWinLine(508, 50, 508, 558); } //O 2,5,8 condition
    else if (arrayIncludes('6O', '4O', '2O')) { drawWinLine(100, 508, 510, 90); } //O 6,4,2 condition
    else if (arrayIncludes('0O', '4O', '8O')) { drawWinLine(100, 100, 520, 520); } //O 0,4,8 condition
    else if (selectedSquares.length >= 9) {                 //checks for a tie, if none of the above conditions are met and 9 squares are selected, it executes
        audio('./media/tie.mp3');                           //plays tie game sound
        setTimeout(function () { resetGame(); }, 1000);     //sets a 1 second timer before the resetGame is called
    }

    function arrayIncludes(squareA, squareB, squareC) {
        const a = selectedSquares.includes(squareA);
        const b = selectedSquares.includes(squareB);
        const c = selectedSquares.includes(squareC);
        if (a === true && b === true && c === true) {return true;}
    }
}


function disableClick() {                       //makes our body element temporarily unclickable
    body.style.pointerEvents = 'none';
    setTimeout(function() {body.style.pointerEvents = 'auto';}, 1000);  //makes our body clickable again after 1 second
}

function audio(audioURL) {              //this function sets string parameter of the path set earlier for placement sound
    let audio = new Audio(audioURL);    //create new audio object and we pass the path as a paramet
    audio.play();                       //play method plays the audio sound
}

function drawWinLine(coordX1, coordY1, coordX2, coordY2) {      //utilizes html canvas to draw win lines
    const canvas = document.getElementById('win-lines');
    const c = canvas.getContext('2d');
    let x1 = coordX1;                           //where the line starts on the x axis
        y1 = coordY1;                           //where the line starts on the y axis
        x2 = coordX2;                           //where the line ends on the x axis
        y2 = coordY2;                           //where the line ends on the y axis
        x = x1                          //stores temporary x axis data to update in animation loop
        y = y1                          //stores temporary y axis data to update in animation loop

    function animateLineDrawing() {                 //interacts with canvas
        const animationLoop = requestAnimationFrame(animateLineDrawing);        //variable creates a loop for when the game ends it restarts
        c.clearRect(0, 0, 608, 608);                                            //clears content from last loop iteration
        c.beginPath();                                                          //starts a new path
        c.moveTo(x1, y1);                                                       //starting point for the line
        c.lineTo(x, y);                                                         //end point of the line
        c.lineWidth = 10;                                                       // width of the line
        c.strokeStyle = 'rgba(70, 255, 33, .8)';                                //color of the line
        c.stroke();                                                             //draws everything as set above
        if (x1 <= x2 && y1 <= y2) {                                             //checks if we've reached the end point
            if (x < x2) { x += 10; }                                            //adds 10 to the previous end x point
            if (y < y2) { y += 10; }                                            //adds 10 to the previous end y point
            if (x >= x2 && y >= y2) { cancelAnimationFrame(animationLoop); }    //cancels our animation loop if reached the end points
        }

        if (x1 <= x2 && y1 >= y2) {                                             //similar to condition above, necessary for 6, 4, 2 win condtion
            if (x < x2) { x += 10; }
            if (y > y2) { y -= 10; }
            if (x >= x2 && y <= y2) { cancelAnimationFrame(animationLoop); }
        }
    }


    function clear() {                                              //clears canvas after win line is drawn
        const animationLoop = requestAnimationFrame(clear);         //starts the animation loop
        c.clearRect(0, 0, 608, 608);                                //clears the canvas
        cancelAnimationFrame(animationLoop);                        //stops the animation loop
    }

    disableClick();                                             //disables clicking while win sound is playing
    audio('./media/winGame.mp3');                               //plays win sound
    animateLineDrawing();                                       //calls the main animation loop
    setTimeout(function () { clear(); resetGame(); }, 1000);    //waits 1 second, clears canvas, resets the game and allows clicking again
}

function resetGame() {
    for (let i = 0; i < 9; i++) {
        let square = document.getElementById(String(i));
        square.style.backgroundImage = '';
    }
    selectedSquares = [];
}