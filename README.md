# [Scracth Card APP](https://mnunes01.github.io/scracthcard/)
react scracth card spa using browser indexedDB storage

# Live Demo
A working version of this app can be found on [React Contact APP](https://mnunes01.github.io/scracthcard/)

[https://mnunes01.github.io/scracthcard/](https://mnunes01.github.io/scracthcard/)

## Instructions
Pull the repo and run **npm install**

- **'npm start'** to run development webpack server
- **'npm run test'** to run JEST tests
- **'npm run build'** to build the project into 'dist' folder


This is a one page aplication
This app emulates a scracthcard using [CreateJS](http://createjs.com/) to create and handle all the canvas drawings and operations
The app uses indexedDB to store a key / value of each play, that is available to view on the History page
The collection is persistent on the browser.
The app was based on the flux pattern to handle external [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) data operations.

Navigating to the home page user is presented with scratch card and the user can use the mouse to scracth or use the reveall all button.
Theres some basic animations implement as also sounds on wining, losing or scratching the card.
After the card is revealled the user can create a new card.
Navigating to History, presents the user with a local browser persisten storage of the previous played cards. The cards will be rendered if the user select one entry for the select list.

# Structure
The class on src/modules/scracthcard/cardgenerator.js is responsible to random create a tic tac toe card, check if the card is wining or lose card and render it into to a cached bitmap.
This class is also used to render the cards from history playes stored on the browser indexedDB storage.
more details on the class itself.

The intention of this approach is to allow the core code to be reused in case theres the desire of adding a diferent scratch card than tic tac toe.
To change the tic tac toe theme for another one we just need to rewrite the method renderCardImg on the cordgenerator class.

All the aspects, size, colors, price and prize values can be configured from:
That allows a easy change of the game aspect without having to change any code.

src/config/config.js
- export const _CURSOR_SIZE = 20 //scracth cursor size
- export const _CURSOR_COLOR = '#B9891E' //scracth cursor color
- export const _SCRATCH_SURFACE_COLOR = 'silver' //scracth surface color
- export const _SCRATCH_REVEAL_AMOUNT = 50 //amount to reveal in pixels when moving the cursor over the card
- export const _SCRATCH_DECLARE_WINNER_AFTER = 60 //total scracth percentage after the card is auto revealled
- export const _WINING_HIGHLIGTH_COLOR = 'gold' //wining line color
- export const _BACKGROUND_COLOR = '#d1ba96' //main scracth card background color
- export const _CROSS_SYMBOL_COLOR = 'green' // cross symbol color
- export const _CIRCLE_SYMBOL_COLOR = 'red' // cross red color
- export const _WIDTH = 400 //main scract card width
- export const _HEIGHT = 400 //main scract card heigth
- export const _CARD_VALUE = 50 //card price
- export const _WINING_RATIO = 2 // ratio value to pay when card is a winner (card value * wining ratio)
- export const _WIN_TXT = 'You WIN!'
- export const _LOSE_TXT = 'You Lose, better luck next time'
- export const _INITIAL_FUNDS_AMOUNT = 1000 // initial funds

## Available commands
Package.json contains several scrips that can be run with npm

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:8080](http://localhost:8000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

## Used NPM packages list
The following packages are used:

- [css-loader](https://www.npmjs.com/package/css-loader)
- [flux](https://www.npmjs.com/package/flux)
- [localforage](https://www.npmjs.com/package/localforage)
- [react](https://www.npmjs.com/package/react)
- [react-dom](https://www.npmjs.com/package/react-dom)
- [react-router-dom](https://www.npmjs.com/package/react-router-dom)
- [react-select](https://www.npmjs.com/package/react-select)
- [style-loader](https://www.npmjs.com/package/style-loader)
- [yuki-createjs](https://www.npmjs.com/package/yuki-createjs)

All of the included packages are maintened used across a significant number of projects

## Testing

For module testing it was used [JEST](https://www.npmjs.com/package/jest)
JEST is configure to search for the tests inside the folders with name *__tests__*

## Music
* Made with love at the sound ( as usual ) of:
* [RadioHead - TKOL RMX 123467](https://open.spotify.com/album/47xaqCsJcYFWqD1gwujl1T)
* [minilogue](https://www.youtube.com/watch?v=qgiL7lsIATA)

@Mnunes 2017 hello:[Mnunes01@hotmail.com](mailto:mnunes01@hotmail.com)
