$(document).ready(initApp);
var game = null;

//Initiate on page load and instantiate all game level obects
function initApp() {
    game = new Game();
    game.initGame();
}