$(document).ready(initApp);
// Game Level One
var easy = null;
//  Game Level Two
var medium = null;
//  Game Level Three
var hard = null;

//Initiate on page load and instantiate all game level obects
function initApp() {
    // Game Level One
    easy = new EasyGame();
    easy.initGame();
    // Game Level Two
    medium = new MediumGame();
    medium.initGame();
    // Game Level Three
    hard = new HardGame();
    hard.initGame();
}