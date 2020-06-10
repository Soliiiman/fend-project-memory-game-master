var matched = [];
var moves = 0;
var restart = document.querySelector('.restart');
restart.addEventListener('click', restartGame);
var moveCounter = document.querySelector('.moves');
// Modal
var modal = document.querySelector('.modal');
var resultMsg = document.querySelector('#resultMsg');
var timeModal = document.querySelector('.time-modal');
var ratingModal = document.querySelector('.rating-modal ');
var movesModal = document.querySelector('.moves-modal');

var restartBtn = document.querySelector('.btn-modal');
restartBtn.addEventListener('click', restartGame);

// Timer
let seconds = 0;
let minutes = 0;
let hours = 0;

const timer = document.querySelector(".timer");

const hourTimer = document.querySelector(".hour");
const minuteTimer = document.querySelector(".minute");
const secondsTimer = document.querySelector(".seconds");

let timeCounter;
let timerOn = false;

// Rating
const stars = document.querySelector('.stars').childNodes;
const starsForRate = document.querySelector('.stars');

/*
 * Create a list that holds all of your cards
 */
var cards = [
    'fa-diamond', 'fa-diamond',
    'fa-paper-plane-o', 'fa-paper-plane-o',
    'fa-anchor', 'fa-anchor',
    'fa-bolt', 'fa-bolt',
    'fa-cube', 'fa-cube',
    'fa-bicycle', 'fa-bicycle',
    'fa-bomb', 'fa-bomb',
    'fa-leaf', 'fa-leaf'
]

function generateCard(card) {
    return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//to restart Game
function restartGame() {
    moveCounter.innerHTML = `0 moves`;
    matched = [];
    timerOn = false;
    seconds = 0;
    minutes = 0;
    hours = 0;
    secondsTimer.innerText = "00";
    minuteTimer.innerText = "00";
    hourTimer.innerText = "00";
    stars[5].classList.remove('grey');
    stars[3].classList.remove('grey');
    initGame();
    main();

}

// to initiate Game
function initGame() {

    var deck = document.querySelector('.deck');
    var cardHtml = shuffle(cards).map(function(card) {
        return generateCard(card);
    });
    deck.innerHTML = cardHtml.join('');
    modal.style.display = 'none';
    clearInterval(timeCounter);
}

initGame();
main();
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//Deck Creation and adding EventListener

function main() {
    var allCards = document.querySelectorAll('.card');
    var openCards = [];
    var moveCounter = document.querySelector('.moves');

    allCards.forEach(function(card) {
        card.addEventListener('click', function(e) {
            if (timerOn === false) {
                startTimer();
                timerOn = true;
            }
            if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
                openCards.push(card);
                card.classList.add('open', 'show');
                if (openCards.length == 2) {
                    //if there is a match
                    if (openCards[0].dataset.card == openCards[1].dataset.card) {
                        openCards[0].classList.add('match');
                        openCards[0].classList.add('open');
                        openCards[0].classList.add('show');

                        openCards[1].classList.add('match');
                        openCards[1].classList.add('open');
                        openCards[1].classList.add('show');
                        openCards = [];
                        matched.push(openCards[0], openCards[1]);
                    } else {
                        // if no match hide 
                        setTimeout(function() {
                            openCards.forEach(function(card) {
                                card.classList.remove('open', 'show');
                            });
                            openCards = [];
                        }, 275);
                    }
                    moves++;
                    moveCounter.innerHTML = `${moves} moves`;
                    starsRating();
                    win();
                    lose();
                }
            }

        });
    });

    // When the player solve the game in time

    function win() {
        if (matched.length == 16) {
            clearInterval(timeCounter);
            modal.style.display = 'block';
            resultMsg.innerHTML = 'Congratulations';
            ratingModal.innerHTML = starsForRate.innerHTML;
            timeModal.innerText = timer.innerText;
            movesModal.innerHTML = `${moves} moves `;

        }
    }

    // when the player exceed Game time (3 min) or number of allowed moves (40)
    function lose() {
        if (moves == 40 || minutes == 3) {
            clearInterval(timeCounter);
            resultMsg.innerHTML = 'Game Over';
            modal.style.display = 'block';
            movesModal.innerHTML = `${moves} moves `;
            ratingModal.innerHTML = 'no rate';
            timeModal.innerText = timer.innerText;

        }
    }
}

// to fix time problem when it less than 10
function fix(x, y) {
    if (x < 10) {
        return (y.innerHTML = ` 0${x}`);
    } else {
        return (y.innerHTML = ` ${x}`);
    }
}

// set timer

function startTimer() {
    // to start the timer to avoid delay
    if (seconds == 0) {
        seconds++;
    }

    timeCounter = setInterval(function() {

        hourTimer.innerHTML = `${hours}`;
        minuteTimer.innerHTML = ` ${minutes} `;
        secondsTimer.innerHTML = ` ${seconds} `;
        // fix each part of the timer
        fix(seconds, secondsTimer);
        fix(minutes, minuteTimer);
        fix(hours, hourTimer);

        seconds++;
        if (seconds == 60) {
            minutes++;
            seconds = 0;
        } else if (minutes == 60) {
            hours++;
            minutes = 0;
        }
    }, 1000);
}

// set rating

function starsRating() {
    // if the moves number is between 12 and 19
    if (moves == 15) {
        // change the color of the third star to grey
        stars[5].classList.add('grey');
        // if the moves number is 20 or more 
    } else if (moves == 30) {
        // change the color of the second star to grey
        stars[3].classList.add('grey');
    }
}