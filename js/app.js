/*jshint esversion: 6 */
/*global document ,$,swal,clearInterval,setTimeout,setInterval */
let symbols = ['diamond', 'diamond', 'paper-plane-o', 'paper-plane-o', 'anchor', 'anchor', 'bolt', 'bolt', 'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb'],
    opened = [],
    match = 0,
    Clicks = 0,
    $deckBox = $(".deck"),
    $cards = $('.card'),
    $scorePanel = $(".score-panel"),
    $moveNum = $(".moves"),
    $ratingStars = $(".fa-star"),
    $PlayAgain = document.querySelector(".restart"),
    delay = 400,
    currentseconds,
    second = 0,
    $seconds = document.getElementById("time-info"),
    totalbox = symbols.length / 2,
    rank3stars = 10,
    rank2stars = 16,
    rank1stars = 20;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
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

/**
 * @description empty content
 * @constructor
 * @param {string} elementID - The name of element
 */
function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = " ";
}

// Initial Game
function initGame() {
    // A list that holds all of  cards
    let boxes = shuffle(symbols);
    // call function clearBox to empty content of parent cards box
    clearBox("deckBox");
    match = 0;
    Clicks = 0;
    $moveNum.textContent = "0";
    $ratingStars.removeClass('fa-thumbs-down').addClass('fa-star');
    for (let box of boxes) {
        $deckBox.append($('<li class="card"><i class="fa fa-' + box + '"></i></li>'));
    }
    // call function addboxListener
    addboxListener();
    // reset the number of seconds to 0 .. stop the timer .. reset timer status (first click (true/false))
    resetseconds(currentseconds);
    second = 0;
    $seconds.textContent = `${second}`;


}

/**
 * @description Set Rating and final Score
 * @constructor
 * @param {number} moves - The number of the moves
 */
function setRating(moves) {
    var rating = 3;
    if (moves > rank3stars && moves < rank2stars) {
        $ratingStars.eq(2).removeClass('fa-fa-star').addClass('fa-thumbs-down');
        rating = 2;
    } else if (moves > rank2stars && moves < rank1stars) {
        $ratingStars.eq(1).removeClass('fa-fa-star').addClass('fa-thumbs-down');
        rating = 1;
    } else if (moves > rank1stars) {
        $ratingStars.eq(0).removeClass('fa-fa-star').addClass('fa-thumbs-down');
        rating = 0;
    }
    return {
        score: rating
    };
}


/**
 * @description End game,Show results function
 * @constructor
 * @param {number} Clikes - The number of the click
 * @param {number} score - The total score
 */
function endGame(Clicks, score) {
    swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'Congratulations! You Won!',
        text: 'With ' + Clicks + ' Clicks and ' + score + ' Stars in ' + second + ' Seconds.\n Woooooo!',
        type: 'success',
        confirmButtonColor: '#02ccba',
        confirmButtonText: 'Play again!'
    }).then(function (isConfirm) {
        if (isConfirm) {
            initGame();
        }
    });
}

//  when click play again button run this function
$PlayAgain.addEventListener('click', function () {
    swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'You need to be a surrender',
        text: "Are you sure",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#02ccba',
        cancelButtonColor: '#f95c3c',
        confirmButtonText: 'Yes',
    }).then(function (isConfirm) {
        if (isConfirm) {
            initGame();
        }
    });
});

// when click on card
var addboxListener = function () {

    // box flip
    $deckBox.find('.card').bind('click', function () {

        // cache $(this) in a variable to improve performance .. don't call it many times just once
        let $this = $(this);
        // features function add timer
        if (!firstClick) {
            initTime();
        }
        if ($this.hasClass('show') || $this.hasClass('match')) {
            return true;
        }

        let box = $this.html();
        $this.addClass('open show');
        opened.push(box);

        // Compare with opened box
        if (opened.length > 1) {
            if (box === opened[0]) {
                $deckBox.find('.open').addClass('match animated infinite rubberBand');
                setTimeout(function () {
                    $deckBox.find('.match').removeClass('open show animated infinite rubberBand');
                }, delay);
                match++;
            } else {
                $deckBox.find('.open').addClass('notmatch animated infinite wobble');
                setTimeout(function () {
                    $deckBox.find('.open').removeClass('animated infinite wobble');
                }, delay / 1.5);
                setTimeout(function () {
                    $deckBox.find('.open').removeClass('open show notmatch animated infinite wobble');
                }, delay);
            }
            opened = [];
            Clicks++;
            setRating(Clicks);
            $moveNum.html(Clicks);
        }

        // End Game if match all boxes
        if (totalbox === match) {
            setRating(Clicks);
            let score = setRating(Clicks).score;
            setTimeout(function () {
                endGame(Clicks, score);
            }, 500);
        }
    });
};



// time for game  function .. count seconds from the game start to the end
let firstClick = false;

function initTime() {
    firstClick = true;
    currentseconds = setInterval(function () {
        $seconds.textContent = `${second}`;
        second = second + 1;
    }, 1000);
}
// restart seconds
function resetseconds(seconds) {
    if (seconds) {
        clearInterval(seconds);
    }
}
// init Game
initGame();