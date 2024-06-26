let music = new Audio('BGM.mp3');
let audioTurn = new Audio('Pencil.mp3');
let turn = "X";
let isgameOver = false;
let scoreX = 0;
let scoreO = 0;
let ties = 0;
let timerInterval; // Variable to store the interval

// Function to change the turn
const changeTurn = () => {
    return turn === "X" ? "O" : "X";
}

// Function to check for a Win or Tie
const checkWin = () => {
    let boxtext = document.getElementsByClassName("boxtext");
    let wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    let filledBoxes = 0;
    wins.forEach(e => {
        if (boxtext[e[0]].innerText === boxtext[e[1]].innerText && boxtext[e[2]].innerText === boxtext[e[1]].innerText && boxtext[e[0]].innerText !== "") {
            document.querySelector('.info').innerText = boxtext[e[0]].innerText + " Won";
            isgameOver = true;
            if (boxtext[e[0]].innerText === "X") {
                scoreX++;
            } else {
                scoreO++;
            }
            updateScores();
            Array.from(document.getElementsByClassName("box")).forEach(box => {
                box.setAttribute("disabled", "true");
            });
            document.querySelector('.imgBox').getElementsByTagName('img')[0].style.width = "300px";
        
            ;
        };
    });
    // Check for a tie
    Array.from(boxtext).forEach(box => {
        if (box.innerText !== "") {
            filledBoxes++;
        }
    });
    if (filledBoxes === 9 && !isgameOver) {
        document.querySelector('.info').innerText = "It's a Tie!";
        isgameOver = true;
        ties++;
        updateScores();
        document.querySelector('.imgBox').getElementsByTagName('img')[0].setAttribute('src', 'try.gif');
        document.querySelector('.imgBox').getElementsByTagName('img')[0].style.width = "300px";
    
;
    }
    
};

// Function to update scores
const updateScores = () => {
    document.getElementById("scoreX").innerText = scoreX;
    document.getElementById("scoreO").innerText = scoreO;
    document.getElementById("ties").innerText = ties;
}

// Game Logic
music.play();

let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
    let boxtext = element.querySelector(".boxtext");
    element.addEventListener("click", () => {
        if (boxtext.innerText === '' && !isgameOver) {
            boxtext.innerText = turn;
            turn = changeTurn();
            audioTurn.play();
            checkWin();
            if (!isgameOver) {
                document.getElementsByClassName("info")[0].innerText = "Turn of " + turn;
            } else {
                Array.from(document.getElementsByClassName("box")).forEach(box => {
                    box.setAttribute("disabled", "true");
                });
            }
        }
    });
});

// Add on click listener to reset button
reset.addEventListener('click', function reset() {
    // Enable the boxes and reset the game state
    Array.from(boxes).forEach(box => {
        box.removeAttribute("disabled");
    });
    let boxtexts = document.querySelectorAll(".boxtext");
    Array.from(boxtexts).forEach(element => {
        element.innerText = "";
    });
    turn = "X";
    isgameOver = false;
    document.getElementsByClassName("info")[0].innerText = "Turn of " + turn;
    document.querySelector('.imgBox').getElementsByTagName('img')[0].style.width = "0";
    let theme = document.querySelectorAll('.link')[0].getAttribute('href');
    let tieImageSrc = '';
    switch(theme) {
        case 'style.css':
            document.querySelector('.imgBox').getElementsByTagName('img')[0].setAttribute('src', 'minion-congrats.gif');
            break;
        case 'style2.css':
            document.querySelector('.imgBox').getElementsByTagName('img')[0].setAttribute('src', 'yoda.gif');
            break;
        case 'style3.css':
            document.querySelector('.imgBox').getElementsByTagName('img')[0].setAttribute('src', 'YO.gif');
            break;
        case 'style4.css':
            document.querySelector('.imgBox').getElementsByTagName('img')[0].setAttribute('src', 'yes.gif');
            break;
        default:
            document.querySelector('.imgBox').getElementsByTagName('img')[0].setAttribute('src', 'minion-congrats.gif'); // Default image if theme not found
    }
  function resetGif() {};


});


// Function to reset the grid automatically
function resetGrid() {
    // Reset the game state
    let boxtexts = document.querySelectorAll(".boxtext");
    Array.from(boxtexts).forEach(element => {
        element.innerText = "";
    });
    turn = "X";
    isgameOver = false;
    document.querySelector('.info').innerText = "Turn of " + turn;
    document.querySelector('.imgBox').getElementsByTagName('img')[0].style.width = "0";
    let theme = document.querySelectorAll('.link')[0].getAttribute('href');
    switch(theme) {
        case 'style.css':
            document.querySelector('.imgBox').getElementsByTagName('img')[0].setAttribute('src', 'minion-congrats.gif');
            break;
        case 'style2.css':
            document.querySelector('.imgBox').getElementsByTagName('img')[0].setAttribute('src', 'yoda.gif');
            break;
        case 'style3.css':
            document.querySelector('.imgBox').getElementsByTagName('img')[0].setAttribute('src', 'YO.gif');
            break;
        case 'style4.css':
            document.querySelector('.imgBox').getElementsByTagName('img')[0].setAttribute('src', 'yes.gif');
            break;
        default:
            document.querySelector('.imgBox').getElementsByTagName('img')[0].setAttribute('src', 'minion-congrats.gif'); // Default image if theme not found
    }
    // Reset the timer

   
}



// Start the timer when the window loads
window.onload = function() {
;
};
function defaultAct() {
    music.pause();
    localStorage.clear();
    document.querySelectorAll('.link')[0].setAttribute('href', 'style.css');
    audioTurn = new Audio('Pencil.mp3');
   document.querySelector('.imgBox').getElementsByTagName('img')[0].style.width = "0";
    document.querySelector('.img').setAttribute('src', 'minion-congrats.gif');
    document.querySelector('audio').setAttribute('src', 'BGM.mp3');
    def = document.querySelector('audio');
    def.play();
    def.loop();
    document.body.style.background = "white";
    
}
function starWars() {
    music.pause();
    localStorage.clear();
    document.querySelectorAll('.link')[0].setAttribute('href', 'style2.css');
    audioTurn = new Audio('lightsaber-sound.mp3');
    document.querySelector('.imgBox').getElementsByTagName('img')[0].style.width = "0";
    document.querySelector('.img').setAttribute('src', 'yoda.gif');
    document.querySelector('audio').setAttribute('src', 'SW.mp3');
    SW = document.querySelector('audio');
    SW.play();
    SW.loop();
}

function strangerThings() {
    music.pause();
    localStorage.clear();
    document.querySelectorAll('.link')[0].setAttribute('href', 'style3.css');
    audioTurn = new Audio('can.mp3');
    document.querySelector('.imgBox').getElementsByTagName('img')[0].style.width = "0";
    document.querySelector('.img').setAttribute('src', 'YO.gif');
    document.querySelector('audio').setAttribute('src', 'Stranger Things.mp3');
    ST = document.querySelector('audio');
    ST.play();
    ST.loop('true');
}
function harryPotter() {
    music.pause();
    localStorage.clear();
    document.querySelectorAll('.link')[0].setAttribute('href', 'style4.css');
    audioTurn = new Audio('Lumos.mp3');
    document.querySelector('.imgBox').getElementsByTagName('img')[0].style.width = "0";
    document.querySelector('.img').setAttribute('src', 'yes.gif');
    document.querySelector('audio').setAttribute('src', 'HPTheme.mp3');
    HP = document.querySelector('audio');
    HP.play();
    HP.loop(true);

}
function mute(){
    document.querySelector('audio').pause();
   audioTurn = new Audio();
};
