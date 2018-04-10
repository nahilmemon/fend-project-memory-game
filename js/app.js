// ------ Global Variables ------ //
const arrayOfPossibleSymbols = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let arrayOfOpenedCards = [];
let cardTimer;
let movesCounter = 0;
let startTime;
let gameHasBegun = false;
let countdownTimer;
let starBoundaryArray = [];
let starCounterIndex = 2; // number of stars minus one
let gameOver = false;
let gameLevelWon = false;
let gameOverallWon = false; // status of whether all levels have been won
let numOfMatchesMade = 0;
let levelIndex = 0;
let arrayOfLevelDeckSizes = [4, 8, 16, 32, 48];
let arrayOfLevelTimeLimits = [10000, 30000, 90000, 180000, 300000]; // in units of ms
const levelMaxIndex = arrayOfLevelDeckSizes.length - 1;
let numOfCards = arrayOfLevelDeckSizes[levelIndex];
let gameTimeLimit = arrayOfLevelTimeLimits[levelIndex]; // in units of ms
let resetGame = true;

// --- Selectors --- //
const cardDeck = document.querySelector('.deck');
const restartButton = document.querySelector('.restart');
const movesCounterSpan = document.querySelector('.moves');
const countdownTimerSpan = document.querySelector('.countdown-timer');
const starList = document.querySelector('.stars');
const modalOverlay = document.querySelector('.modal-overlay');
const modalGameOver = document.querySelector('#modal-game-over');
const modalClose = modalGameOver.querySelector('.modal-close');
const modalTriggerButton = document.querySelector('.modal-trigger');
const modalRestartButton = document.querySelector('.modal-restart-button');
const modalGameOverTitle = modalGameOver.querySelector('.game-over-title');
const modalStarList = modalGameOver.querySelector('.modal-stars');
const modalMovesCounterSpan = modalGameOver.querySelector('.moves');
const modalTimeRemainingSpan = modalGameOver.querySelector('.time-taken');
const modalNextLevelButton = modalGameOver.querySelector('.modal-next-level-button');

// ------ Functions ------ //
// Create a new card deck array from the given array of possible symbols
function createNewCardDeckArray(arrayOfAllSymbols, sizeOfCardDeck) {
  // Determine the number of card symbols needed
  // One card deck should have half the number of symbols as there are cards
  let numOfCardSymbols = sizeOfCardDeck/2;

  // Shuffle the possible symbols array
  shuffle(arrayOfAllSymbols);

  // Create a new card deck array from the array of possible symbols:
  let newCardDeckArray = [];
  let j = 0;
  for (let i=0; i<numOfCardSymbols; i++) {
    // j is determined this way in case there aren't as many symbols as
    // there are pairs of cards that need to be made
    j = i % arrayOfAllSymbols.length;
    newCardDeckArray.push(arrayOfAllSymbols[j]);
  }

  // Duplicate these symbols
  newCardDeckArray = [...newCardDeckArray, ...newCardDeckArray];

  // Shuffle the deck
  shuffle(newCardDeckArray);

  return newCardDeckArray;
}

// Delete the old card deck HTML,
// create a new card deck array,
// and add this new card deck to the deck ul list
function updateHTMLWithNewCardDeck(sizeOfCardDeck) {
  // Delete the old card deck HTML
  cardDeck.innerHTML = '';

  // Create new card deck array
  const newCardDeckArray = createNewCardDeckArray(arrayOfPossibleSymbols, numOfCards);

  // Create a document fragment to store the new HTML while it's being generated
  const docFragment = document.createDocumentFragment();
  // Create a bunch of card elements and add it to the docFragment
  for (let i = 0; i < sizeOfCardDeck; i++) {
    const newCardElement = document.createElement('li');
    newCardElement.classList.add('card');
    newCardElement.innerHTML = `<i class="fa ${newCardDeckArray[i]}"></i>`;
    docFragment.appendChild(newCardElement);
  }
  // Add the new card deck HTML from the docFragment
  cardDeck.appendChild(docFragment); // reflow and repaint here -- once!
}

// Shuffle the items in a given array
// Note: this function was taken from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Reveal the given card input
function revealCard(cardElement) {
  cardElement.classList.add('open', 'show');
}

// Add given card input to the array of opened cards
function addCardToArrayOfOpenedCards(cardElement, arrayOfSelectedCards) {
  arrayOfSelectedCards.push(cardElement);
}

// Lock given cards by showing that they have been matched and
// removing them from the array of opened cards
function lockMatchedCards(cardElement1, cardElement2, arrayOfSelectedCards) {
  // Indicate that the given cards have been matched
  cardElement1.classList.add('match');
  cardElement2.classList.add('match');
  // Remove these cards from the array of opened cards
  arrayOfSelectedCards.pop();
  arrayOfSelectedCards.pop();
}

// Given two card element inputs,
// hide these cards and remove these cards from the array of opened cards
function hideAndRemoveOpenedCards(cardElement1, cardElement2, arrayOfSelectedCards) {
  // Hide the given cards
  cardElement1.classList.remove('open', 'show');
  cardElement2.classList.remove('open', 'show');
  // Remove these cards from the array of opened cards
  arrayOfSelectedCards.pop();
  arrayOfSelectedCards.pop();
}

// Update the number of moves counter
function updateMovesCounter(numOfMovesCounter, movesHTMLSelector) {
  numOfMovesCounter++;
  movesHTMLSelector.innerHTML = numOfMovesCounter;
  return numOfMovesCounter;
}

// Reset the number of moves counter
function resetMovesCounter(numOfMovesCounter, movesHTMLSelector) {
  numOfMovesCounter = 0;
  movesHTMLSelector.innerHTML = numOfMovesCounter;
  return numOfMovesCounter;
}

// Generate the star boundaries to compare with the moves counter
function generateStarBoundaries(boundariesArray, sizeOfCardDeck) {
  // Figure out the number of pairs for the given card deck size
  const numOfPairs = sizeOfCardDeck/2;
  // Generate each star boundary based on the number of pairs
  boundariesArray[0] = Math.round(numOfPairs*1.25 + 1);
  boundariesArray[1] = Math.round(numOfPairs*1.625 + 1);
  boundariesArray[2] = Math.round(numOfPairs*2 + 1);
  return boundariesArray;
}

// Empty a star in the score panel
function removeAStar(listOfStars, starIndex) {
  // Change the last full star into an empty star
  listOfStars.children[starIndex].firstElementChild.classList.replace('fa-star', 'fa-star-o');
  // Update the star counter index
  starIndex--;
  return starIndex;
}

// Empty a star from the star list whenever the moves counter hits any of the
// star boundaries
function updateStarList(boundariesArray, numOfMoves, listOfStars, starIndex) {
  for (let i=0; i<boundariesArray.length; i++) {
    if (numOfMoves == boundariesArray[i]) {
      starIndex = removeAStar(listOfStars, starIndex);
    }
  }
  return starIndex;
}

// Empty all stars from the score panel
function removeAllStars(listOfStars, starIndex) {
  // Change all the stars into empty stars
  for (let i=0; i<listOfStars.children.length; i++) {
    listOfStars.children[i].firstElementChild.classList.replace('fa-star', 'fa-star-o');
  }
  // Update the star counter index
  starIndex = 0;
  return starIndex;
}

// Reset the star list by filling up all the stars
function resetStarList(listOfStars, starIndex) {
  // Change all the stars into full stars
  for (let i=0; i<listOfStars.children.length; i++) {
    listOfStars.children[i].firstElementChild.classList.replace('fa-star-o', 'fa-star');
  }
  // Reset the star counter index
  starIndex = 2;
  return starIndex;
}

// Get the time at which the game started
function getStartTime() {
  const timeGameStarted = performance.now();
  return timeGameStarted;
}

// Update the countdown timer and insert this into the score panel
function updateCountdownTimer(timeGameStarted) {
  // Get the current time
  const currentTime = performance.now();
  // Get the time elapsed since the game began
  const timeElapsed = currentTime - timeGameStarted;
  // Get the amount of time remaining to play the game
  const timeRemaining = gameTimeLimit - timeElapsed;
  // Update the HTML with the amount of time remaining
  countdownTimerSpan.innerHTML = Math.round(timeRemaining/1000);
  // Check if time ran out or if the game has finished
  isTheGameOverAndWon(timeRemaining);
}

// Reset the countdown timer in the score panel
function resetCountdownTimer(countdownBeginningTime) {
  countdownTimerSpan.innerHTML = Math.round(countdownBeginningTime/1000);
}

// Set the countdown timer in the score panel to 0
function setCountdownTimerToZero() {
  // Update the score panel html count down timer to 0
  countdownTimerSpan.innerHTML = 0;
}

// Update the contents of the game over modal based on the current status
// of the game (game won/loss state, number of stars, number of moves, and
// time taken)
function updateGameOverModalContents() {
  // Change the game over title sentence based on whether the level and/or game
  // was won
  // Check if the user won the current level of the game
  if (gameLevelWon == true) {
    // Check if the user won all the levels
    if (gameOverallWon == true) {
      // Change the game over title to the whole game was won
      modalGameOverTitle.innerHTML = 'Congratulations! You won the game!';
      // Hide the next level button
      modalNextLevelButton.classList.add('hide');
    }
    // Else if there are still more levels to complete
    else {
      // Change the game over title to the level was won
      modalGameOverTitle.innerHTML = 'Congratulations! You beat this level!';
      // Show the next level button
      modalNextLevelButton.classList.remove('hide');
    }
  }
  // Else if the user lost the level (and thus the lost the whole game)
  else {
    // Change the game over title to the whole game was lost
    modalGameOverTitle.innerHTML = 'Boo! You lost the game!';
    // Hide the next level button
    modalNextLevelButton.classList.add('hide');
  }

  // Update the star counter
  // by cloning the star list in the game score panel section
  // If the level was lost, then empty all the stars
  if (gameLevelWon == false) {
    starCounterIndex = removeAllStars(starList, starCounterIndex);
  }
  // Clone the star list in the score panel
  const ulStarsCloned = starList.cloneNode(true);
  // Empty the previous contents of the modal's star list
  modalStarList.innerHTML = '';
  // Add the clones score panel's star list into the modal's star list container
  modalStarList.appendChild(ulStarsCloned);

  // Update the moves counter
  modalMovesCounterSpan.innerHTML = movesCounter;

  // Update the time taken span
  // Make sure that the countdown timer is set to zero and not a negative
  // number if the game was lost
  if (gameOverallWon == false) {
    setCountdownTimerToZero();
  }
  // Find out how much time was remaining
  const timeRemaining = countdownTimerSpan.innerHTML;
  // Find out how much time was used up
  const timeElapsed = Math.round(gameTimeLimit/1000 - timeRemaining);
  // Update the time taken span in the modal
  modalTimeRemainingSpan.innerHTML = timeElapsed;
}

// Figure out if the game is over yet and if it has been won or not
function isTheGameOverAndWon(timeRemaining) {
  // If the game isn't over AND
  // EITHER the time ran out OR all matches were made
  // then update the relevant booleans to state that the game finished
  // and whether it was won or lost
  if ((timeRemaining < 0 || numOfMatchesMade == numOfCards/2) && gameOver == false) {
    // Update the game over status
    gameOver = true;
    // Clear the card timer
    clearTimeout(cardTimer);
    // Clear the game countdown timer
    clearInterval(countdownTimer);
    // If the user matched all the cards before the timer ran out,
    // then alert him/her that he/she won the level and/or overall game
    if (numOfMatchesMade == numOfCards/2) {
      // Update the game level won status
      gameLevelWon = true;
      // If the last level was won,
      // then update the game overall won status and the reset game status
      if (levelIndex == levelMaxIndex) {
        gameOverallWon = true;
        resetGame = true;
      }
      // Else if the level was lost,
      // then update the game overall won status to lost and update the
      // reset game status accordingly
      else {
        gameOverallWon = false;
        resetGame = false;
      }
    }
    // Else if the timer ran out before all the matches were made,
    // then alert the user that he/she lost the game
    else {
      // Update the game overall won status
      gameOverallWon = false;
      // Update the game level status
      gameLevelWon = false;
      // Update the reset game status
      resetGame = true;
    }
    // Update the contents of the game over modal
    updateGameOverModalContents();
    // Display the modal
    toggleModalGameOver();
  }
}

// Restart the game by creating a new deck of cards and resetting all
// global variables
function restartGame() {
  // Reset the level index if reset game is true
  if (resetGame == true) {
    levelIndex = 0;
  }
  // Otherwise increment the level
  else {
    levelIndex++;
  }
  // Update the size of the deck
  numOfCards = arrayOfLevelDeckSizes[levelIndex];
  // Update the game time limit
  gameTimeLimit = arrayOfLevelTimeLimits[levelIndex];
  // Reset the game has begun boolean
  gameHasBegun = false;
  // Reset the number of moves counter
  movesCounter = resetMovesCounter(movesCounter, movesCounterSpan);
  // Reset the star list and the star counter index
  starCounterIndex = resetStarList(starList);
  // Regenerate the star boundaries array
  generateStarBoundaries(starBoundaryArray, numOfCards);
  // Clear the card timer
  clearTimeout(cardTimer);
  // Clear the game countdown timer
  clearInterval(countdownTimer);
  // Reset the countdown timer in the HTML
  resetCountdownTimer(gameTimeLimit);
  // Reset the game state statuses
  gameOver = false;
  numOfMatchesMade = 0;
  gameLevelWon = false;
  gameOverallWon = false;
  // Empty the array of opened cards
  arrayOfOpenedCards = [];
  // Create a new deck of cards and add this to the HTML
  updateHTMLWithNewCardDeck(numOfCards);
}

// Show/hide the game over modal
function toggleModalGameOver() {
  modalGameOver.classList.toggle('modal-show');
}

// ------ Initialization ------ //
// Reset all game parameters and generate a new card deck
restartGame();

// ------ Events ------ //
// When the user clicks the restart button,
// update the card deck HTML with a new card deck
restartButton.addEventListener('click', function() {
  resetGame = true;
  restartGame();
});

// When a card is clicked,
// reveal this card and check if it matches any previously selected cards.
// Otherwise hide the selected cards.
cardDeck.addEventListener('click', function (event) {
  // Save the selected target
  const clickedCard = event.target;
  // Make sure that the selected targest was actually a card li
  // and not the deck ul
  // Also make sure that the clicked card hasn't already been matched
  if (clickedCard.nodeName.toUpperCase() == 'LI' && clickedCard.classList.contains('match') == false && gameOver == false) {
    // If the game has not yet begun, then change this status
    if (gameHasBegun == false) {
      gameHasBegun = true;
      // Get the time at which the game started
      startTime = getStartTime();
      // Start the countdown timer
      countdownTimer = setInterval(function() {
        updateCountdownTimer(startTime);
      }, 1000);
    }

    // If 2 cards have already been clicked,
    // then hide and remove the previously opened cards
    if (arrayOfOpenedCards.length == 2) {
      // clear out the card timer for hiding and removing the last two cards
      clearTimeout(cardTimer);
      // hide and remove the first two cards in the array of opened cards
      hideAndRemoveOpenedCards(arrayOfOpenedCards[0], arrayOfOpenedCards[1], arrayOfOpenedCards);
    }

    // Reveal the currently selected card and add it to the array of opened cards
    // if the array of opened cards is empty OR
    // if the array is not empty AND
    // the previously selected cards is not the currently selected card
    if (arrayOfOpenedCards.length == 0 || clickedCard != arrayOfOpenedCards[0]) {
     // Display the selected card's symbol
      revealCard(clickedCard);
      // Add the selected card to the array of opened cards
      addCardToArrayOfOpenedCards(clickedCard, arrayOfOpenedCards);
    }

    // If the arrray of opened cards already has another card in it,
    // then check if the clicked card matches the other card in the array
    if (arrayOfOpenedCards.length > 1) {
      // Update the number of moves counter
      movesCounter = updateMovesCounter(movesCounter, movesCounterSpan);
      // Update the star list
      starCounterIndex = updateStarList(starBoundaryArray, movesCounter, starList, starCounterIndex);
      // If the two cards match,
      // then lock the matched cards
      if (clickedCard.innerHTML == arrayOfOpenedCards[0].innerHTML) {
        lockMatchedCards(clickedCard, arrayOfOpenedCards[0], arrayOfOpenedCards);
        numOfMatchesMade++;
      }
      // Otherwise, if there is no match,
      // then hide and remove these cards from the array of opened cards
      // after a short delay
      else {
        cardTimer = setTimeout(function() {
          hideAndRemoveOpenedCards(clickedCard, arrayOfOpenedCards[0], arrayOfOpenedCards)
        }, 1000);
      }
    }
  }
});

// When the user clicks on the close modal button, close the modal
modalClose.addEventListener('click', toggleModalGameOver);

// When the user clicks anywhere outside of the modal, close it
modalOverlay.addEventListener('click', toggleModalGameOver);

// When the user clicks on the restart button,
// close the modal and restart the game
modalRestartButton.addEventListener('click', function(){
  toggleModalGameOver();
  resetGame = true;
  restartGame();
});

// When the user clicks the next level button,
// then close the modal, change the level settings, and restart the game
// with these new settings
modalNextLevelButton.addEventListener('click', function() {
  toggleModalGameOver();
  resetGame = false;
  restartGame();
});