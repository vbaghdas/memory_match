$(document).ready(initApp);
var game = null;

//Initiates on page load and instantiates the Game object
function initApp() {
    game = new MemoryMatchGame();
    game.initGame();
}