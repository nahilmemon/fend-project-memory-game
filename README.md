# Memory Game Project

## Table of Contents

* [Description](#description)
* [Basic Gameplay Mechanics](#basic-gameplay-mechanics)
* [Minimum Requirements](#minimum-requirements)
* [Extra Features](#extra-features)
* [Resources Used](#resources-used)


## Description

This is a browser-based memory card matching game (aka Concentration, Memory Game, or Match Up). This project was forked from a very basic, static [starter template](https://github.com/udacity/fend-project-memory-game). Using HTML, CSS, and JS, the project was developed to become interactive, usable across various device sizes and orientations, and many new features were added as well.

## Basic Gameplay Mechanics

The user is presented with a deck of cards that are placed face down. The user can flip open up to two cards at a time. If the cards have matching symbols, then the cards are locked open. Otherwise, they are flipped closed. The objective of the game is to match all the cards before time runs out. There are a total of five levels with an increasing number of cards to match in each level. The user can use hints to reveal matches and also customize the difficulty setting and the card icon themes as well.

## Minimum Requirements

The minimum requirements of this project involved implementing the following features:
* Randomly shuffle all the cards
* A win condition when the user matches all the cards correctly
* A modal popup to congratulate the user when they win the game, depict the star rating and how much time was taken to complete the game, and ask the user if they want to play the game again
* A restart button to let the user reset the card deck, the timer, and the star rating
* A star rating system based on how many moves were made by the user
* A timer that begins when the user begins the game and ends when the game is finished
* A move counter to count how many moves the user made
* CSS to style the game components
* Ensure that the game is usable across modern desktop, tablet, and phone browsers

## Extra Features

Extra features that were added to the game included:
* A hint button to reveal two matching cards if no cards are currently flipped open or to reveal the second instance of the currently flipped open card
* A countdown timer instead of just recording how much time was taken. This way, the user is limited in terms of how much time there is to finish the game, create a game loss condition and building up the suspense in playing the game
* A leveling up system with a total of five levels in which the number of cards to match increases
* A dropdown to select the difficulty setting which alters the number of hints given, the countdown timer limit, and the star rating system
* The star rating system was modified to be affected by not only the number of moves made, but also the number of hints used, and the difficulty setting
* A dropdown to select the card icon themes which is ordered in increasing difficulty in terms of the number of icons and/or the ability to distinguish between the icons
* Animating the cards opening, closing, being hinted, and being matched using the Web Animations API
* Adding more detailed information to the modal which pops up when the game is lost, the level is won, or the whole game is won. Each game state changes the color palette of the modal. New information includes the game state, the number of moves made, the number of hints used, and a button to advance to the next level only if the current level was won and there are still more levels to play

## Resources Used

* [Font Awesome icons](https://fontawesome.com)
* [Subtle Patterns background image](https://www.toptal.com/designers/subtlepatterns/xv/)
* [Array shuffle function](http://stackoverflow.com/a/2450976)
* [Web Animations API tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API)
* [Modal effects tutorial](https://tympanus.net/Development/ModalWindowEffects/)
