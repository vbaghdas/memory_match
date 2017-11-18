$(document).ready(initApp);
var game = null;
var responsive = null;

//Initiate on page load and instantiate game and responsive objects
function initApp() {
    game = new Game();
    game.initGame();
    
    responsive = new Responsive();
    responsive.initRes();
}