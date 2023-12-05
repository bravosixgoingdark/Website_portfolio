// https://www.youtube.com/watch?v=oKM2nQdQkIU&pp=ygUNd29yZGxlIGNsb25lIA%3D%3D
import {dict} from '/scripts/wordlist.js';

const gamestate = {
    secret: dict[Math.floor(Math.random() * dict.length)], // random word from dictionary
    grid: Array(5)
        .fill()
        .map(() => Array(5).fill('')),
    currentrow: 0,
    currentcol: 0,
};

function setCookie(cname, cvalue, exdays) { // https://stackoverflow.com/questions/14266730/js-how-to-cache-a-variable
    var d = new Date(); // get date
    d.setTime(d.getTime() + (exdays*24*60*60*1000)); // set time
    var expires = "expires="+ d.toUTCString(); // set expires
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"; // set cookie
}

function getCookie(cname) { // https://stackoverflow.com/questions/14266730/js-how-to-cache-a-variable
    var name = cname + "="; // get name
    var ca = document.cookie.split(';'); // split cookie
    for(var i = 0; i < ca.length; i++) { // loop through cookie
        var c = ca[i]; // get cookie
        while (c.charAt(0) == ' ') { // while first character is a space
            c = c.substring(1); // remove space
        }
        if (c.indexOf(name) == 0) { // if name is found
            return c.substring(name.length, c.length); // return cookie
        }
    }
}
function check_score(){
    var score = getCookie("wordle_score");
    if (score!=null && score!="") {
        console.log(score);
        document.getElementById("score").innerHTML = score;
    }
    else {
        score = 0;
        document.getElementById("score").innerHTML = score;
    }
    return score;
}
function updategame(){ // update the game
    for (let i = 0; i < gamestate.grid.length; i++){ // loop through rows
        for (let j = 0; j < gamestate.grid[i].length; j++){ // loop through columns
            const box = document.getElementById(`box${i}${j}`); // get box
            box.textContent = gamestate.grid[i][j]; // update box
        }
    }
}

function draw(container, row, col, letter = '') { // draw the box
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = letter;
    box.id = `box${row}${col}`;
  
    container.appendChild(box);
    return box;
}

function drawgrid(container){
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 5; i++){ // 5 rows
        for (let j = 0; j < 5; j++){ // 5 columns
            draw(grid, i, j); // create a box
        }
    }
    container.appendChild(grid); // add grid to container
}


function keyboard_event() {
    let submit = document.getElementById('submit');
    document.body.onkeydown = (e) => { 
        const key = e.key;
        if (key === 'Enter') {
        if (gamestate.currentcol === 5) { // if the current column is 5
            enter_word();
        }
        }
        if (key === 'Backspace') {;
            removeLetter();
        }
        if (isLetter(key)) {
            addLetter(key);
        }
    
    updategame();
    };
    submit.addEventListener('click', enter_word); // add event listener to submit button
}



function enter_word(){
    const word = getWord(); // get word
        if (word_checker(word)){ // if word is valid
            reveal(word); // reveal word
            gamestate.currentrow++; // go to next row
            gamestate.currentcol = 0; // reset column
    } else {
        alert('Not a valid word.'); // if word is not valid
        }
}

function getWord(){
    return gamestate.grid[gamestate.currentrow].reduce((prev, curr) => prev + curr); // get word from grid
}

function word_checker(word){ // check if word is valid
    return dict.includes(word);
}

function getoccurences(word, letter){ // get occurences of letter in word
    let count = 0;
    for (let i = 0; i < word.length; i++){
        if (word[i] === letter){
            count++;
        }
    }
    return count;
}

function whereoccurences(word, letter, position){
    let count = 0;
    for (let i = 0; i <= position; i++){
        if (word[i] === letter){
            count++;
        }
    }
}

function reveal(word){
    const row = gamestate.currentrow;
    for (let i = 0; i < 5; i++){
        const box = document.getElementById(`box${row}${i}`); // get box
        const letter = box.textContent; // get letter
        const occurances_secret = getoccurences(gamestate.secret, letter); // get occurences of letter in secret word
        const occurances_guess = getoccurences(word, letter);
        const pos = whereoccurences(word, letter, i);
            if (occurances_guess > occurances_secret && pos > occurances_secret){ // if there are more occurences of the letter in the guess than in the secret word
                box.classList.add('empty');
            } else {
                if (letter === gamestate.secret[i]){
                    box.classList.add('correct');
            } else if (gamestate.secret.includes(letter)){
                box.classList.add('wrong');
            } else {
                box.classList.add('empty');
            } 
        }
    }
    const win_condition = gamestate.secret === word;
    const game_over = gamestate.currentrow === 5;
    let score = Number(check_score());
    if (win_condition){
        alert('You win!');
        score += 1;
        document.getElementById("score").innerHTML = score;
        setCookie("wordle_score", score, 7);
        window.location.reload(false);
    } else if (game_over){
        alert('You lose! The word was ' + gamestate.secret + '.');
        window.location.reload(false);
    }
}

function isLetter(key){
    return key.length === 1 && key.match(/[a-z]/i);
}
function addLetter(letter){
    if (gamestate.currentcol === 5){
        return;
    }
    gamestate.grid[gamestate.currentrow][gamestate.currentcol] = letter;
    gamestate.currentcol++;
}

function removeLetter(){
    if (gamestate.currentcol === 0){
        return;
    }
    gamestate.grid[gamestate.currentrow][gamestate.currentcol - 1] = ''; // remove letter
    gamestate.currentcol--;
}

function reset(){
    window.location.reload(false);
}

let reset_button = document.getElementById('reset');
reset_button.addEventListener('click', reset);


function start(){
    check_score();
    const game = document.getElementById('wordle');
    drawgrid(game);
    keyboard_event();
    console.log(gamestate.secret);
}



start();