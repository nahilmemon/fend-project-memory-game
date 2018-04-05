// ------ Global Variables ------ //
const arrayOfPossibleSymbols = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
const numOfCards = 16;
let arrayOfOpenedCards = [];
let cardTimer;
let movesCounter = 0;
const gameTimeLimit = 10000; // in units of ms
let startTime;
let gameHasBegun = false;
let countdownTimer;

// --- Selectors --- //
const cardDeck = document.querySelector('.deck');
const restartButton = document.querySelector('.restart');
const movesCounterSpan = document.querySelector('.moves');
const countdownTimerSpan = document.querySelector('.countdown-timer');

// ------ Functions ------ //
// Create a new card deck array from the given array of possible symbols
function createNewCardDeckArray(arrayOfAllSymbols, sizeOfCardDeck) {
  // Determine the number of card symbols needed
  // One card deck should have half the number of symbols as there are cards
  // Round this number up in case an odd number is given
  let numOfCardSymbols = Math.ceil(sizeOfCardDeck/2);
  // Make sure that numOfCardSymbols is a reasonable number
  if (numOfCardSymbols < 2) {
    // Should have at least two pairs
    numOfCardSymbols = 2;
  } else if (numOfCardSymbols > arrayOfAllSymbols.length) {
    // should have no more pairs than what is available to choose from
    numOfCardSymbols = arrayOfAllSymbols.length;
  }

  // Shuffle the possible symbols array
  shuffle(arrayOfAllSymbols);

  // Create a new card deck array from the array of possible symbols:
  // Get the number of symbols needed
  let newCardDeckArray = arrayOfAllSymbols.slice(0, numOfCardSymbols);
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

// Get the time at which the game started
function getStartTime() {
  const timeGameStarted = performance.now();
  return timeGameStarted;
}

// Update the countdown timer and insert this into the HTML
function updateCountdownTimer(timeGameStarted) {
  // Get the current time
  const currentTime = performance.now();
  // Get the time elapsed since the game began
  const timeElapsed = currentTime - timeGameStarted;
  // Get the amount of time remaining to play the game
  const timeRemaining = gameTimeLimit - timeElapsed;
  // Update the HTML with the amount of time remaining
  countdownTimerSpan.innerHTML = Math.round(timeRemaining/1000);
}

// Reset the countdown timer in the HTML
function resetCountdownTimer(countdownBeginningTime) {
  countdownTimerSpan.innerHTML = Math.round(countdownBeginningTime/1000);
}

// Restart the game by creating a new deck of cards and resetting all
// global variables
function restartGame() {
  // Reset the game has begun boolean
  gameHasBegun = false;
  // Reset the number of moves counter
  movesCounter = resetMovesCounter(movesCounter, movesCounterSpan)
  // Clear the card timer
  clearTimeout(cardTimer);
  // Clear the game countdown timer
  clearInterval(countdownTimer);
  // Reset the countdown timer in the HTML
  resetCountdownTimer(gameTimeLimit);
  // Empty the array of opened cards
  let arrayOfOpenedCards = [];
  // Create a new deck of cards and add this to the HTML
  updateHTMLWithNewCardDeck(numOfCards);
}

// ------ Initialization ------ //
// Add a new card deck to the HTML
updateHTMLWithNewCardDeck(numOfCards);

// ------ Events ------ //
// When the user clicks the restart button,
// update the card deck HTML with a new card deck
restartButton.addEventListener('click', restartGame);

// When a card is clicked,
// reveal this card and check if it matches any previously selected cards.
// Otherwise hide the selected cards.
cardDeck.addEventListener('click', function (event) {
  // Save the selected target
  const clickedCard = event.target;
  // Make sure that the selected targest was actually a card li
  // and not the deck ul
  // Also make sure that the clicked card hasn't already been matched
  if (clickedCard.nodeName.toUpperCase() == 'LI' && clickedCard.classList.contains('match') == false) {
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
      // If the two cards match,
      // then lock the matched cards
      if (clickedCard.innerHTML == arrayOfOpenedCards[0].innerHTML) {
        lockMatchedCards(clickedCard, arrayOfOpenedCards[0], arrayOfOpenedCards);
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