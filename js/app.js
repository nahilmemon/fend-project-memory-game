// ------ Global Variables ------ //
let arrayOfPossibleSymbols = [];
let arrayOfOpenedCards = [];
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
let difficulty = 0; // 0: easy, 1: medium, 2: hard
let arrayOfLevelDeckSizes = [4, 8, 16, 24, 36]; // square number or square number - 1
let arraysOfLevelTimeLimits = [
  [12000, 30000, 55000, 90000, 200000],
  [9000, 22000, 39000, 75000, 130000],
  [6000, 13000, 29000, 55000, 100000]
]; // in units of ms
const levelMaxIndex = arrayOfLevelDeckSizes.length - 1;
let numOfCards = arrayOfLevelDeckSizes[levelIndex];
let gameTimeLimit = arraysOfLevelTimeLimits[difficulty][levelIndex]; // in units of ms
let resetGame = true;
let hintCounter = 0;
let hintsLeftCounter = 0;
const arraysOfIconSets = [
  [
    'fa-bolt', 'fa-sun', 'fa-cloud', 'fa-tint', 'fa-umbrella', 'fa-snowflake',
    'fa-moon', 'fa-leaf', 'fa-tree', 'fa-seedling', 'fa-fire'
  ],
  [
    'fa-box-open', 'fa-boxes', 'fa-clipboard-list', 'fa-dolly', 'fa-pallet',
    'fa-truck-moving', 'fa-shipping-fast', 'fa-warehouse', 'fa-truck-loading',
    'fa-tape', 'fa-map-signs'
  ],
  [
    'fa-baseball-ball', 'fa-basketball-ball', 'fa-bowling-ball', 'fa-football-ball',
    'fa-futbol', 'fa-golf-ball', 'fa-hockey-puck', 'fa-quidditch', 'fa-table-tennis',
    'fa-volley-ball'
  ],
  [
    'fa-balance-scale', 'fa-bed', 'fa-bell', 'fa-book', 'fa-briefcase', 'fa-building',
    'fa-coffee', 'fa-fire-extinguisher', 'fa-flag-checkered', 'fa-flask', 'fa-gamepad',
    'fa-home', 'fa-hospital-alt', 'fa-industry', 'fa-life-ring', 'fa-map',
    'fa-map-marker-alt', 'fa-map-signs', 'fa-money-bill-alt', 'fa-paw', 'fa-plane',
    'fa-rocket', 'fa-ship', 'fa-shopping-cart', 'fa-ticket-alt', 'fa-tree',
    'fa-university', 'fa-utensils'
  ],
  [
    'fa-database', 'fa-desktop', 'fa-hdd', 'fa-headphones', 'fa-keyboard', 'fa-laptop',
     'fa-microchip', 'fa-mobile-alt', 'fa-plug', 'fa-print', 'fa-save', 'fa-server',
     'fa-tablet-alt', 'fa-tv', 'fa-gamepad', 'fa-camera', 'fa-video', 'fa-fax',
     'fa-phone', 'fa-android', 'fa-apple', 'fa-windows', 'fa-battery-empty',
     'fa-bluetooth-b'
  ],
  [
    'fa-allergies', 'fa-ambulance', 'fa-band-aid', 'fa-capsules', 'fa-diagnoses',
    'fa-dna', 'fa-file-medical-alt', 'fa-first-aid', 'fa-heartbeat', 'fa-hospital-alt',
    'fa-pills', 'fa-prescription-bottle', 'fa-procedures', 'fa-stethoscope',
    'fa-syringe', 'fa-tablets', 'fa-thermometer', 'fa-user-md', 'fa-vial', 'fa-vials',
    'fa-weight', 'fa-x-ray', 'fa-wheelchair'
  ],
  [
    'fa-ambulance', 'fa-bicycle', 'fa-bus', 'fa-car', 'fa-motorcycle', 'fa-plane',
    'fa-rocket', 'fa-ship', 'fa-space-shuttle', 'fa-subway', 'fa-train', 'fa-truck',
    'fa-taxi', 'fa-parachute-box'
  ],
  [
    'fa-bitcoin', 'fa-dollar-sign', 'fa-euro-sign', 'fa-lira-sign', 'fa-pound-sign',
    'fa-ruble-sign', 'fa-rupee-sign', 'fa-shekel-sign', 'fa-won-sign', 'fa-yen-sign',
     'fa-cc-amazon-pay', 'fa-cc-amex', 'fa-cc-apple-pay', 'fa-cc-diners-club',
     'fa-cc-discover', 'fa-cc-jcb', 'fa-cc-mastercard', 'fa-cc-paypal', 'fa-cc-stripe',
     'fa-cc-visa', 'fa-credit-card', 'fa-ethereum', 'fa-google-wallet', 'fa-paypal'
  ],
  [
    'fa-hand-holding', 'fa-hand-lizard', 'fa-hand-paper', 'fa-hand-peace',
    'fa-hand-point-down', 'fa-hand-point-left', 'fa-hand-point-right',
    'fa-hand-point-up', 'fa-hand-rock', 'fa-hand-scissors', 'fa-hand-spock',
    'fa-hands', 'fa-handshake', 'fa-thumbs-down', 'fa-thumbs-up', 'fa-sign-language',
    'fa-american-sign-language-interpreting'
  ]
];
let doNotChangeLevel = false;
let arraysOfAnimationPlayers = [[], [], [], []]; // 0: opening, 1: closing, 2: matching, 3: hinting
const cardBackColor = '#987f64';
const cardFrontColor = '#ae92b7';
const cardMatchColor = '#75b6e8';
const cardHintColor = '#e7916e';

// --- Selectors --- //
const cardDeck = document.querySelector('.deck');
const restartButton = document.querySelector('.restart');
const movesCounterSpan = document.querySelector('.moves');
const countdownTimerSpan = document.querySelector('.countdown-timer');
const starList = document.querySelector('.stars');
const modalGameOver = document.querySelector('#modal-game-over');
const modalRestartButton = document.querySelector('.modal-restart-button');
const modalGameOverTitle = modalGameOver.querySelector('.game-over-title');
const modalStarList = modalGameOver.querySelector('.modal-stars');
const modalMovesCounterSpan = modalGameOver.querySelector('.moves');
const modalTimeRemainingSpan = modalGameOver.querySelector('.time-taken');
const modalNextLevelButton = modalGameOver.querySelector('.modal-next-level-button');
const hintButton = document.querySelector('.hint');
const hintsLeftSpan = document.querySelector('.hints-left');
const modalHintsUsedSpan = modalGameOver.querySelector('.hints-used');
const dropdownIconSetSelect = document.querySelector('.dropdown.icon-set');
const dropdownDifficultySelect = document.querySelector('.dropdown.difficulty');
const levelSpan = document.querySelector('.level');
const modalOverlay = document.querySelector('.modal-overlay');
const modalGameOverHeader = modalGameOver.querySelector('.modal-header');
const modalGameOverBody = modalGameOver.querySelector('.modal-body');
const modalGameOverFooter = modalGameOver.querySelector('.modal-footer');

// --- Animation Helpers --- //
// Keyframes
let keyframesFlipCardOpen = [
  { transform: 'rotateY(180deg)', background: cardBackColor, fontSize: '0' },
  { background: cardBackColor, fontSize: '0', offset: 0.5 },
  { background: cardFrontColor, fontSize: '33px', offset: 0.50001 },
  { transform: 'rotateY(0deg)', background: cardFrontColor, fontSize: '33px' }
];
let keyframesFlipCardClose = [
  { transform: 'rotateY(0deg)', background: cardFrontColor, fontSize: '33px' },
  { background: cardFrontColor, fontSize: '33px', offset: 0.5 },
  { background: cardBackColor, fontSize: '0', offset: 0.50001 },
  { transform: 'rotateY(180deg)', background: cardBackColor, fontSize: '0' }
];
// The following two keyframe details have been taken from
// http://www.theappguruz.com/tag-tools/web/CSSAnimations/
const keyframesMatch = [
 { transform: 'scale3d(1, 1, 1)', background: cardFrontColor },
 { transform: 'scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)', offset: 0.1 },
 { transform: 'scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg)', offset: 0.2 },
 { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)', offset: 0.3 },
 { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)', offset: 0.4 },
 { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)', offset: 0.5 },
 { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)', offset: 0.6 },
 { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)', offset: 0.7 },
 { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)', offset: 0.8 },
 { transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)', offset: 0.9 },
 { transform: 'scale3d(1, 1, 1)', background: cardMatchColor }
];
const keyframesHint = [
 { transform: 'translate3d(0, 0, 0)', background: cardBackColor },
 { transform: 'translate3d(-10px, 0, 0)', offset: 0.1 },
 { transform: 'translate3d(10px, 0, 0)', offset: 0.2 },
 { transform: 'translate3d(-10px, 0, 0)', offset: 0.3 },
 { transform: 'translate3d(10px, 0, 0)', offset: 0.4 },
 { transform: 'translate3d(-10px, 0, 0)', background: cardHintColor, offset: 0.5 },
 { transform: 'translate3d(10px, 0, 0)', offset: 0.6 },
 { transform: 'translate3d(-10px, 0, 0)', offset: 0.7 },
 { transform: 'translate3d(10px, 0, 0)', offset: 0.8 },
 { transform: 'translate3d(-10px, 0, 0)', offset: 0.9 },
 { transform: 'translate3d(0, 0, 0)', background: cardBackColor }
];
// Timing
const timingShowHint = {
  duration: 1000,
  fill: 'backwards'
}
const timingShowMatches = {
  duration: 1000,
  fill: 'both'
}
const timingFlipCardOpen = {
  duration: 500,
  fill: 'both'
}
const timingFlipCardClose = {
  duration: 500,
  fill: 'both',
  delay: 500
}

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
    newCardElement.classList.add('card', 'flex-container', 'flex-justify-center', 'flex-align-center');
    newCardElement.innerHTML = `<i class="fas ${newCardDeckArray[i]}"></i>`;
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

// Reveal the given card input and add it to the array of opened cards
function revealCard(cardElement, arrayOfSelectedCards) {
  // Indicate that the given card has been opened
  cardElement.classList.add('open');

  // Animate the given card to look like it's flipping open
  let cardOpeningPlayer = cardElement.animate(
    keyframesFlipCardOpen,
    timingFlipCardOpen
  );

  // Add the above animation player into the arraysOfAnimationPlayers[0]
  // (open card players)
  arraysOfAnimationPlayers[0].push(cardOpeningPlayer);

  // Add the given card to the array of opened cards
  arrayOfSelectedCards.push(cardElement);
}

// Lock given cards by showing that they have been matched and
// removing them from the array of opened cards
function lockMatchedCards(cardElement1, cardElement2, arrayOfSelectedCards) {
  // Indicate that the given cards have been matched
  cardElement1.classList.add('match');
  cardElement2.classList.add('match');

  // When the last card has finished flipping open,
  // then animate the given cards to signify a match has been made
  arraysOfAnimationPlayers[0][1].onfinish = function() {
    // Create the animation players for each card with the match
    // animation keyframes
    let cardMatchingPlayer1 = cardElement1.animate(
      keyframesMatch,
      timingShowMatches
    );
    let cardMatchingPlayer2 = cardElement2.animate(
      keyframesMatch,
      timingShowMatches
    );

    // Add these animation players into arraysOfAnimationPlayers[2]
    // (match card players)
    arraysOfAnimationPlayers[2].push(cardMatchingPlayer1);
    arraysOfAnimationPlayers[2].push(cardMatchingPlayer2);

    // When the match animations have finished,
    // then empty arraysOfAnimationPlayers[2] (match card players)
    arraysOfAnimationPlayers[2][1].onfinish = function() {
      arraysOfAnimationPlayers[2] = [];
    };

    // Remove these cards from the array of opened cards
    arrayOfSelectedCards.pop();
    arrayOfSelectedCards.pop();
  };

  // Empty arraysOfAnimationPlayers[0] (open card players)
  arraysOfAnimationPlayers[0] = [];
}

// Given two card element inputs,
// hide these cards and remove these cards from the array of opened cards
function hideAndRemoveOpenedCards(cardElement1, cardElement2, arrayOfSelectedCards) {
  // Inidcate that the given cards are no longer open
  cardElement1.classList.remove('open');
  cardElement2.classList.remove('open');

  // When the last card has finished flipping open,
  // then close the given cards by animating them as flipping over
  arraysOfAnimationPlayers[0][1].onfinish = function() {
    // Create the animation players for each card with the flip close
    // animation keyframes and timing (which has an inherent 1 second delay)
    let cardClosingPlayer1 = cardElement1.animate(
      keyframesFlipCardClose,
      timingFlipCardClose
    );
    let cardClosingPlayer2 = cardElement2.animate(
      keyframesFlipCardClose,
      timingFlipCardClose
    );

    // Add these animation players into arraysOfAnimationPlayers[1]
    // (close card players)
    arraysOfAnimationPlayers[1].push(cardClosingPlayer1);
    arraysOfAnimationPlayers[1].push(cardClosingPlayer2);

    // When the flip card close animations have finished,
    // then empty arraysOfAnimationPlayers[1] (close card players)
    arraysOfAnimationPlayers[1][1].onfinish = function() {
      arraysOfAnimationPlayers[1] = [];

      // Remove these cards from the array of opened cards
      arrayOfSelectedCards.pop();
      arrayOfSelectedCards.pop();
    };
  };

  // Empty arraysOfAnimationPlayers[0] (open card players)
  arraysOfAnimationPlayers[0] = [];
}

// Update the number of moves counter
function updateMovesCounter(numOfMovesCounter, movesHTMLSelector) {
  numOfMovesCounter++;
  movesHTMLSelector.innerHTML = numOfMovesCounter;
  return numOfMovesCounter;
}

// Update the number in the level span
function updateLevelSpan(level, levelSpanSelector) {
  // The level displayed should be one more than the level index (since it starts
  // at 0 instead of 1)
  level++;
  // Update the level span with this corrected value;
  levelSpanSelector.innerHTML = level;
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
  boundariesArray[0] = Math.round(numOfPairs*1.5 + 1);
  boundariesArray[1] = Math.round(numOfPairs*2.0 + 1);
  boundariesArray[2] = Math.round(numOfPairs*2.5 + 1);
  return boundariesArray;
}

// Empty a star in the score panel
function removeAStar(listOfStars, starIndex) {
  // Change the last full star into an empty star
  listOfStars.children[starIndex].firstElementChild.classList.remove('fas');
  listOfStars.children[starIndex].firstElementChild.classList.add('far');
  // Update the star counter index
  starIndex--;
  return starIndex;
}

// Empty a star from the star list whenever the moves counter hits any of the
// star boundaries
function updateStarList(boundariesArray, numOfMoves, listOfStars, starIndex, numOfHints, difficultySetting) {
  // The number of hints used, the number of moves made, and the difficulty setting
  // should all affect the number of stars left
  let numOfMovesAndHints;
  if (difficultySetting == 0) {
    numOfMovesAndHints = numOfMoves + numOfHints*1;
  } else if (difficultySetting == 1) {
    numOfMovesAndHints = numOfMoves + numOfHints*2;
  } else {
    numOfMovesAndHints = numOfMoves + numOfHints*3;
  }

  // Iterate through the star boundary array and determine whether the
  // numOfMovesAndHints has hit any of the boundaries.
  // If so, then remove a star
  for (let i=0; i<boundariesArray.length; i++) {
    if (numOfMovesAndHints == boundariesArray[i]) {
      starIndex = removeAStar(listOfStars, starIndex);
    }
  }
  return starIndex;
}

// Empty all stars from the score panel
function removeAllStars(listOfStars, starIndex) {
  // Change all the stars into empty stars
  for (let i=0; i<listOfStars.children.length; i++) {
    listOfStars.children[i].firstElementChild.classList.remove('fas');
    listOfStars.children[i].firstElementChild.classList.add('far');
  }
  // Update the star counter index
  starIndex = 0;
  return starIndex;
}

// Reset the star list by filling up all the stars
function resetStarList(listOfStars, starIndex) {
  // Change all the stars into full stars
  for (let i=0; i<listOfStars.children.length; i++) {
    listOfStars.children[i].firstElementChild.classList.remove('far');
    listOfStars.children[i].firstElementChild.classList.add('fas');
  }
  // Reset the star counter index
  starIndex = 2;
  return starIndex;
}

// Generate the number of hints left
function generateHintsLeft(hintsRemainingCounter, hintsRemainingSelector, sizeOfCardDeck, difficultySetting) {
  // The initial number of hints left should depend on the difficulty setting
  // and the size of the deck
  if (difficultySetting == 0) {
    hintsRemainingCounter = Math.ceil(sizeOfCardDeck*0.50);
  } else if (difficultySetting == 1) {
    hintsRemainingCounter = Math.ceil(sizeOfCardDeck*0.25);
  } else {
    hintsRemainingCounter = Math.floor(sizeOfCardDeck*0.10);
  }
  // Update the hints left span with this new value
  hintsRemainingSelector.innerHTML = hintsRemainingCounter;
  return hintsRemainingCounter;
}

// Update the hint counter and the hints left counter
function updateHintsLeft(hintsUsedCounter, hintsRemainingCounter, hintsRemainingSelector) {
  // Increment the hints used counter
  hintsUsedCounter++;
  // Decrement the hints left counter
  hintsRemainingCounter--;
  // Update the hints left span in the score panel
  hintsRemainingSelector.innerHTML = hintsRemainingCounter;
  return [hintsUsedCounter, hintsRemainingCounter];
}

// Reveal two matching cards
function revealCardMatch(firstCard, secondCard, revealBothHints) {
  // Animate the first card with a hint animation,
  // only if both cards need to be revealed to the user
  if (revealBothHints == true) {
    // Create an animation player with the hint animation keyframes
    let cardHintingPlayer1 = firstCard.animate(
      keyframesHint,
      timingShowHint
    );

    // Add this animation player into arraysOfAnimationPlayers[3]
    // (hint card players)
    arraysOfAnimationPlayers[3].push(cardHintingPlayer1);
  }

  // Animate the second card with a hint animation
  // Create an animation player with the hint animation keyframes
  let cardHintingPlayer2 = secondCard.animate(
    keyframesHint,
    timingShowHint
  );

  // Add this animation player into arraysOfAnimationPlayers[3]
  // (hint card players)
  arraysOfAnimationPlayers[3].push(cardHintingPlayer2);

  // When the hint animations have finished,
  // then empty arraysOfAnimationPlayers[3] (hint card players)
  arraysOfAnimationPlayers[3][0].onfinish = function() {
    arraysOfAnimationPlayers[3] = [];
  };
}

// Hide all the hinted cards
function hideHintedCards() {
  // For each hint animation player in the arraysOfAnimationPlayers[3],
  // force the hint animation to finish immediately
  for (let i=0; i<arraysOfAnimationPlayers[3].length; i++) {
    arraysOfAnimationPlayers[3][i].finish();
  }

  // Empty arraysOfAnimationPlayers[3] (hint card players)
  arraysOfAnimationPlayers[3] = [];
}

// Find the match for the desired card when the user asks for a hint
function findCardMatch() {
  // Only find a match if there are any hints left
  if (hintsLeftCounter > 0) {
    let firstCard, secondCard; // to store the matching cards
    let showBothHints = true; // to determine how many cards to animate
    // If no cards have been selected when the hint button was selected,
    // then let the firstCard be the first unopened card without a match,
    // and the secondCard be the second instance of the card with the same
    // icon as the firstCard's icon
    if (arrayOfOpenedCards.length == 0) {
      // Get the firstCard for which a match is desired
      // by looking for the first unopened, unmatched card
      firstCard = document.querySelector('li.card:not(.open):not(.match)');
      // Get the firstCard's icon
      const firstCardIcon = firstCard.firstElementChild.classList[1];
      // Find the matching secondCard's icon by looking through the card deck ul
      // There will be more than one unopened, unmatched card with the same
      // icon since the firstCard hasn't been opened yet either,
      // so find the whole list of elements that match this criteria and
      // choose the second element in this list for the second icon
      const secondCardIconQuerySelectorString = `li.card:not(.open):not(.match) > i.${firstCardIcon}`;
      const secondCardIcon = document.querySelectorAll(secondCardIconQuerySelectorString)[1];
      // Get the secondCard
      secondCard = secondCardIcon.parentElement;
    }
    // Otherwise, if a card is already open,
    // then let the firstCard be the already openeed card that has no match,
    // and the secondCard be the first instance of an unopened, unmatched
    // card with the same icon as the firstCard
    else if (arrayOfOpenedCards.length == 1) {
      // Update the show both hints boolean since only one card needs to be animated
      showBothHints = false;
      // Get the firstCard for which a match is desired
      // by choosing the already clicked upon card
      firstCard = arrayOfOpenedCards[0];
      // Get the firstCard's icon
      const firstCardIcon = firstCard.firstElementChild.classList[1];
      // Find the matching secondCard's icon by looking through the card deck ul
      // for the first unopened, unmatched card with the same icon
      // as the firstCard's icon since the firstCard is already open
      let secondCardIconQuerySelectorString = `li.card:not(.open):not(.match) > i.${firstCardIcon}`;
      const secondCardIcon = document.querySelector(secondCardIconQuerySelectorString);
      // Get the secondCard
      secondCard = secondCardIcon.parentElement;
    }
    // Reveal the two cards
    revealCardMatch(firstCard, secondCard, showBothHints);
    // Update the values of the hints used counter and the hints left counter
    // and the text in hints left span in the score panel
    [hintCounter, hintsLeftCounter] = updateHintsLeft(hintCounter, hintsLeftCounter, hintsLeftSpan);
  }
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

// Change the sizes of the cards based on the number of cards being displayed
// i.e. based on the current level
function changeCardSizesBasedOnLevel(level) {
  // Get the current list of cards
  const cards = document.querySelectorAll('.card');

  // Determine the max possible deckWidth and deckHeight
  let deckWidth, deckHeight, deckPaddingX, deckPaddingY;
  // Change the padding of the deck based on the number of cards since the match
  // animation takes up a lot of space for larger sized cards
  if (level < 3) {
    deckPaddingX = 15; // horizontal padding
    deckPaddingY = 15; // vertical padding
  } else {
    deckPaddingX = 5; // horizontal padding
    deckPaddingY = 5; // vertical padding
  }
  const deckMarginX = 2; // horizontal margin
  const deckMarginY = 2; // vertical margin
  const leftHalfSectionWidth = document.querySelector('.left-half').getBoundingClientRect().width;
  const leftHalfSectionHeight = document.querySelector('.left-half').getBoundingClientRect().height;

  // The deckWidth is 100vw - the horizontal padding and margin
  // (and - left half's width depending on the page layout)
  // The deckHeight is 100vh - (the vertical padding and margin + the height of
  // all the other elements on the screen above the deck depending on the layout)
  // Landscape mode
  if (window.innerWidth < 769 && window.innerWidth > window.innerHeight) {
    deckWidth = window.innerWidth - (deckPaddingX*2 + deckMarginX*2 + leftHalfSectionWidth);
    deckHeight = window.innerHeight - (deckPaddingY*2 + deckMarginY);
  }
  // Portrait mode
  else {
    deckWidth = window.innerWidth - (deckPaddingX*2 + deckMarginX*2);
    deckHeight = window.innerHeight - (deckPaddingY*2 + deckMarginY*2 + leftHalfSectionHeight);
  }

  // The deck should be a square, so let the smaller length (between deckWidth
  // and deckHeight) dictate the final dimensions of the deck
  if (deckWidth < deckHeight) {
    deckHeight = deckWidth;
  } else {
    deckWidth = deckHeight;
  }

  // Calculate the card size (the cards should also be squares)
  let cardWidth, cardHeight;
  const numOfCardsPerRow = level + 2;
  // The space between each card should be 2.5% of the deck's size
  // So the total space is this multiplied by the number of cards per row
  const totalSpacingBetweenCardsPerRow = 0.025 * deckWidth * numOfCardsPerRow;
  // The margin of the card on each side
  const cardMarginOneSide = totalSpacingBetweenCardsPerRow/(2 * numOfCardsPerRow) - 1;
  // The card size is thus the amount of space left over / the number of cards per row
  cardWidth = (deckWidth - totalSpacingBetweenCardsPerRow - deckPaddingX * 2)/numOfCardsPerRow;

  // Add the padding to the deck dimensions
  deckWidth += deckPaddingX*2;
  deckHeight += deckPaddingY*2
  // Set the deck size's css based on the calculated dimensions above
  cardDeck.setAttribute('style', `width: ${deckWidth}px; height: ${deckHeight}px; padding: ${deckPaddingX}px ${deckPaddingY}px;`);
  // Set each card's dimensions and margin based on the calculations above
  for (let i=0; i<cards.length; i++) {
    cards[i].setAttribute('style', `width: ${cardWidth}px; height: ${cardWidth}px; margin: ${cardMarginOneSide}px;`);
  }

  // Change the font size of the icons based on the current size of the cards
  // and the number of cards on screen (i.e. the current level)
  let iconFontSize;
  if (level < 3) {
    iconFontSize = cardWidth * 0.5;
  } else {
    iconFontSize = cardWidth * 0.7;
  }
  // Update the card opening and closing keyframes with the new icon font size
  keyframesFlipCardOpen[2].fontSize = `${iconFontSize}px`;
  keyframesFlipCardOpen[3].fontSize = `${iconFontSize}px`;
  keyframesFlipCardClose[0].fontSize = `${iconFontSize}px`;
  keyframesFlipCardClose[1].fontSize = `${iconFontSize}px`;
}

// Change the color palette of the game over modal based on whether the user
// won the level, won the overall game, or lost the overall game
function changeModalColorPalette(gameWon, levelWon) {
  if (levelWon == true) {
    // The user won the whole game
    if (gameWon == true) {
      modalOverlay.classList.remove('level-won-overlay', 'game-lost-overlay');
      modalOverlay.classList.add('game-won-overlay');

      modalGameOverHeader.classList.remove('level-won-inverted', 'game-lost-inverted');
      modalGameOverHeader.classList.add('game-won-inverted');
      modalGameOverFooter.classList.remove('level-won-inverted', 'game-lost-inverted');
      modalGameOverFooter.classList.add('game-won-inverted');

      modalGameOverBody.classList.remove('level-won', 'game-lost');
      modalGameOverBody.classList.add('game-won');
      modalRestartButton.classList.remove('level-won', 'game-lost');
      modalRestartButton.classList.add('game-won');
      modalNextLevelButton.classList.remove('level-won', 'game-lost');
      modalNextLevelButton.classList.add('game-won');
    } else { // The user won only the level
      modalOverlay.classList.remove('game-lost-overlay', 'game-won-overlay');
      modalOverlay.classList.add('level-won-overlay');

      modalGameOverHeader.classList.remove('game-lost-inverted', 'game-won-inverted');
      modalGameOverHeader.classList.add('level-won-inverted');
      modalGameOverFooter.classList.remove('game-lost-inverted', 'game-won-inverted');
      modalGameOverFooter.classList.add('level-won-inverted');

      modalGameOverBody.classList.remove('game-lost', 'game-won');
      modalGameOverBody.classList.add('level-won');
      modalRestartButton.classList.remove('game-lost', 'game-won');
      modalRestartButton.classList.add('level-won');
      modalNextLevelButton.classList.remove('game-lost', 'game-won');
      modalNextLevelButton.classList.add('level-won');
    }
  } else { // The user lost the game
    modalOverlay.classList.remove('level-won-overlay', 'game-won-overlay');
    modalOverlay.classList.add('game-lost-overlay');

    modalGameOverHeader.classList.remove('level-won-inverted', 'game-won-inverted');
    modalGameOverHeader.classList.add('game-lost-inverted');
    modalGameOverFooter.classList.remove('level-won-inverted', 'game-won-inverted');
    modalGameOverFooter.classList.add('game-lost-inverted');

    modalGameOverBody.classList.remove('level-won', 'game-won');
    modalGameOverBody.classList.add('game-lost');
    modalRestartButton.classList.remove('level-won', 'game-won');
    modalRestartButton.classList.add('game-lost');
    modalNextLevelButton.classList.remove('level-won', 'game-won');
    modalNextLevelButton.classList.add('game-lost');
  }
}

// Update the contents of the game over modal based on the current status
// of the game (game won/loss state, number of stars, number of moves, and
// time taken)
function updateGameOverModalContents() {
  // Change the color palette of the modal based on whether the level and/or
  // game was won/lost
  changeModalColorPalette(gameOverallWon, gameLevelWon);
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

  // Update the hints used span
  modalHintsUsedSpan.innerHTML = hintCounter;

  // Update the time taken span
  // Make sure that the countdown timer is set to zero and not a negative
  // number if the game was lost
  if (gameLevelWon == false) {
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
    // Hide all the hinted cards
    hideHintedCards();
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
    let modalDelayTimer = setTimeout(function() {
      toggleModalGameOver();
    }, 1500);
  }
}

// Get the value of the selected option in the given <select> dropdown
function getDropdownValue(dropdownSelector) {
  let dropdownValue = dropdownSelector.options[dropdownSelector.selectedIndex].value;
  return dropdownValue;
}

// Change the color of the dropdown <select> based on the color of the
// selected option
function changeDropdownSelectColor(dropdownSelector) {
  // Get the classList of the option that is currently selected
  const selectedOptionClassList = dropdownSelector.options[dropdownSelector.selectedIndex].classList;
  // Remove all the classes currently acting on the dropdown <select>
  dropdownSelector.classList.remove('easy', 'medium', 'hard');
  // Add the class of the currently selected option to the dropdown <select>
  dropdownSelector.classList.add(selectedOptionClassList[0]);
}

// Get the icon set array of icon classes based on the selected option
// in the icon set dropdown
function getIconSetArray(dropdownSelector, arraysOfIconSets) {
  // Get the value of the selected option in the icon set dropdown
  const dropdownIconSetValue = getDropdownValue(dropdownSelector);
  // Get the corresponding array of icon classes based on this value
  const arrayOfSymbols = arraysOfIconSets[dropdownIconSetValue];

  // Change the color of dropdown <select> based on the color of the
  // option selected
  changeDropdownSelectColor(dropdownSelector);

  return arrayOfSymbols;
}

// Get the difficulty setting based on the option selected in the
// corresponding dropdown dropdown
function getDifficultySetting(dropdownSelector) {
  // Get the value of the selected option in the difficulty setting dropdown
  const difficultySetting = getDropdownValue(dropdownSelector);

  // Change the color of dropdown <select> based on the color of the
  // option selected
  changeDropdownSelectColor(dropdownSelector);

  return difficultySetting;
}

// Finish all the currently playing animations and reset the
// arraysOfAnimationPlayers
function finishAndResetAnimations() {
  // Go into each array in the arraysOfAnimationPlayers
  for (let i=0; i<arraysOfAnimationPlayers.length; i++) {
    // Iterate over each animation player stored in the ith array
    // in the arraysOfAnimationPlayers
    for (let j=0; j<arraysOfAnimationPlayers[i].length; j++) {
      // Finish this animation player's animation
      arraysOfAnimationPlayers[i][j].finish();
    }
  }

  // Empty the arraysOfAnimationPlayers
  arraysOfAnimationPlayers = [[], [], [], []];
}

// Restart the game by creating a new deck of cards and resetting all
// global variables
function restartGame() {
  // Reset the level index if reset game is true
  if (resetGame == true) {
    levelIndex = 0;
  }
  // Otherwise increment the level only if it is okay to change it
  else if (doNotChangeLevel == false) {
    levelIndex++;
  }
  // Else if it is not okay to change the level,
  // then don't touch the levelIndex and reset doNotChangeLevel
  else {
    doNotChangeLevel = false;
  }
  // Update the level displayed in the level span
  updateLevelSpan(levelIndex, levelSpan);
  // Get the difficulty setting
  difficulty = getDifficultySetting(dropdownDifficultySelect);
  // Update the size of the deck
  numOfCards = arrayOfLevelDeckSizes[levelIndex];
  // Update the game time limit
  gameTimeLimit = arraysOfLevelTimeLimits[difficulty][levelIndex];
  // Reset the game has begun boolean
  gameHasBegun = false;
  // Reset the number of moves counter
  movesCounter = resetMovesCounter(movesCounter, movesCounterSpan);
  // Reset the star list and the star counter index
  starCounterIndex = resetStarList(starList);
  // Regenerate the star boundaries array
  generateStarBoundaries(starBoundaryArray, numOfCards);
  // Regenerate the number of hints left
  hintsLeftCounter = generateHintsLeft(hintsLeftCounter, hintsLeftSpan, numOfCards, difficulty);
  // Reset the hints used counter
  hintCounter = 0;
  // Hide all the hinted cards
  hideHintedCards();
  // Clear the game countdown timer
  clearInterval(countdownTimer);
  // Reset the countdown timer in the HTML
  resetCountdownTimer(gameTimeLimit);
  // Finish all currently running animations and reset the arraysOfAnimationPlayers
  finishAndResetAnimations();
  // Reset the game state statuses
  gameOver = false;
  numOfMatchesMade = 0;
  gameLevelWon = false;
  gameOverallWon = false;
  // Empty the array of opened cards
  arrayOfOpenedCards = [];
  // Populate the array of symbols with the desired icon set based off the
  // selected option in the icon set dropdown
  arrayOfPossibleSymbols = getIconSetArray(dropdownIconSetSelect, arraysOfIconSets);
  // Create a new deck of cards and add this to the HTML
  updateHTMLWithNewCardDeck(numOfCards);
  // Resize the cards based on the level
  changeCardSizesBasedOnLevel(levelIndex);
}

// Show/hide the game over modal
function toggleModalGameOver() {
  modalGameOver.classList.toggle('modal-show');
}

// Determine whether the game has begun
// If so, then update the gameHasBegun status and start the countdown timer
function determineAndBeginGame() {
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
  // and that not more than two unmatched cards are opened at a given time
  if (clickedCard.nodeName.toUpperCase() == 'LI' && clickedCard.classList.contains('match') == false &&  arrayOfOpenedCards.length < 2 && gameOver == false) {
    // If the game has not yet begun, then change this status and start the
    // countdown timer
    determineAndBeginGame();

    // Hide all hinted cards
    hideHintedCards();

    // Reveal the currently selected card and add it to the array of opened cards
    // if the array of opened cards is empty OR
    // if the array is not empty AND
    // the previously selected cards is not the currently selected card
    if (arrayOfOpenedCards.length == 0 || clickedCard != arrayOfOpenedCards[0]) {
      // Display the selected card's symbol
      revealCard(clickedCard, arrayOfOpenedCards);
    }

    // If the arrray of opened cards already has another card in it,
    // then check if the clicked card matches the other card in the array
    if (arrayOfOpenedCards.length > 1) {
      // Update the number of moves counter
      movesCounter = updateMovesCounter(movesCounter, movesCounterSpan);
      // Update the star list
      starCounterIndex = updateStarList(starBoundaryArray, movesCounter, starList, starCounterIndex, hintCounter);
      // If the two cards match,
      // then lock the matched cards
      if (clickedCard.innerHTML == arrayOfOpenedCards[0].innerHTML) {
        lockMatchedCards(clickedCard, arrayOfOpenedCards[0], arrayOfOpenedCards);
        numOfMatchesMade++;
      }
      // Otherwise, if there is no match,
      // then hide and remove these cards from the array of opened cards
      else {
        hideAndRemoveOpenedCards(clickedCard, arrayOfOpenedCards[0], arrayOfOpenedCards)
      }
    }
  }
});

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

// When the user clicks on the hint button,
// then reveal two matching cards
hintButton.addEventListener('click', function() {
  // Find and reveal two matching cards
  findCardMatch();
  // If the game has not yet begun, then change this status and start the
  // countdown timer
  determineAndBeginGame();
});

// When the user selects an icon set in the corresponding dropdown,
// restart the game at the current level with cards with the desired set of icons
// only if the icon set currently chosen is different from the previous choice
dropdownIconSetSelect.addEventListener('change', function() {
  resetGame = false;
  doNotChangeLevel = true;
  restartGame();
});

// When the user selects a difficulty setting in the corresponding dropdown,
// restart the game with this difficulty at level 0 only if the setting currently
// chosen is different from the previous choice
dropdownDifficultySelect.addEventListener('change', function() {
  resetGame = true;
  doNotChangeLevel = false;
  restartGame();
});

// Whenever the window gets resized, change the sizes of the cards to fit
// within the window's current size
window.addEventListener('resize', function() {
  changeCardSizesBasedOnLevel(levelIndex);
});