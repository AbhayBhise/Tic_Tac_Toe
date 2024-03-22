let music = new Audio('BGM.mp3');
let audioTurn = new Audio('Pencil.mp3');
let turn = "X";
let isgameOver = false;

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
            Array.from(document.getElementsByClassName("box")).forEach(box => {
                box.setAttribute("disabled", "true");
            });
            document.querySelector('.imgBox').getElementsByTagName('img')[0].style.width = "300px";
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
        document.querySelector('.imgBox').getElementsByTagName('img')[0].setAttribute('src', 'tie-image.gif');
        document.querySelector('.imgBox').getElementsByTagName('img')[0].style.width = "300px";
    }
};

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
})

// Add on click listener to reset button
reset.addEventListener('click', () => {
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
   // document.querySelector('.imgBox').getElementsByTagName('img')[0].setAttribute('src', 'minion-congrats.gif');
});

// Other functions (defaultAct, starWars, strangerThings, harryPotter, mute) remain unchanged


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
};

