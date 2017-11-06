function EasyGame() {
    this.clickedCardsList = [];
    this.cardList = [];
    this.matchCount = 0;
    this.matchCounter = 0;
    this.attempts = 0;
    this.accuracy = 0;
    this.revertTime = 2000;
    this.level = 'Easy';
    this.imageList = [
        'assets/images/easy/front1.jpg',
        'assets/images/easy/front2.jpg',
        'assets/images/easy/front3.jpg',
        'assets/images/easy/front4.jpg',
        'assets/images/easy/front5.jpg',
        'assets/images/easy/front6.jpg',
        'assets/images/easy/front7.jpg',
        'assets/images/easy/front8.jpg',
    ];
    this.soundList = {
        'intro' : new Audio("assets/sounds/intro.mp3"),
        'blop' : new Audio("assets/sounds/blop.mp3"),
        'flop' : new Audio("assets/sounds/flop.mp3"),
        'match' : new Audio("assets/sounds/match.wav"),
        'wrong' : new Audio("assets/sounds/wrong.wav"),
        'victory' : new Audio("assets/sounds/victory.wav")
    };

    //Initializes when the page loads
    this.initGame = function () {
        this.createCards(this.shuffleCards());
        this.handleReset();
        this.updateStats();
        this.showModalInfo();
        this.handleModalInfo();
        this.handleModal();
        this.handleAudioPlay();
        this.handleAudioStop();
        this.handleElementHover();
    };

    //Randomizes the deck of cards in the array
    this.shuffleCards = function () {
        var images = this.imageList.concat(this.imageList);
        var currentIndex = images.length, temp, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temp = images[currentIndex];
            images[currentIndex] = images[randomIndex];
            images[randomIndex] = temp;
        }
        return images;
    };

    //Creates the cards in the deck and instantiates the cards created for the DOM
    this.createCards = function(images){
        for(var i = 0; i < images.length; i++){
            var newCard = new Card(this, images[i]);
            var cardElement = newCard.render();
            $("#game-container-easy").append(cardElement);

            this.cardList.push(newCard);
        }
        return this.cardList;
    };

    //Handles game logic, statistics counter, and reverts cards if there is no match
    this.handleCardClick = function(cardObj) {
        this.handleCardRevealed(); 
        this.soundList.flop.play();
        if(this.clickedCardsList.length < 2){
            this.clickedCardsList.push(cardObj);
            cardObj.revealSelf();

            if(this.clickedCardsList.length === 2){
                if(this.clickedCardsList[0].getID() === this.clickedCardsList[1].getID()){
                    this.matchCount+=2;
                    this.matchCounter++;
                    this.attempts++;
                    this.clearClickedCardsList();
                    this.calculateAccuracy();
                    this.handleCardMatch();
                    setTimeout( ()=>{ this.soundList.match.play() }, 500);

                    if(this.matchCount === this.cardList.length){
                        this.playerWins();
                    }
                }
                else {
                    this.attempts++;
                    this.calculateAccuracy();
                    setTimeout( ()=>{ this.soundList.wrong.play() }, 500);
                    setTimeout(this.revertClickedCards.bind(this), this.revertTime);
                }
            }
        }
    };

    //Win handler runs when all cards are matched and targets victory modal
    this.playerWins = function() {
        this.showModal();
        this.easyLevelChange();
        this.soundList.victory.play();
    };

    this.handleCardRevealed = function() {
        
    }

    //Reverts the clicked cards list back to its original empty state
    this.clearClickedCardsList = function () {
        this.clickedCardsList = [];
    };
    this.revertClickedCards = function() {
        for(var i = 0; i < this.clickedCardsList.length; i++){
            this.clickedCardsList[i].hideSelf();
        }
        this.clearClickedCardsList();
    };

    //Updates and Displays Stats on the DOM
    this.updateStats = function () {
        this.displayStats();
    }

    //Displays the stats on the DOM
    this.displayStats = function() {
        $(".level").text(this.level);
        $(".attempts").text(this.attempts);
        $(".accuracy").text(this.accuracy);
    };

    //Calculates the accuracy stat
    this.calculateAccuracy = function() {
        this.accuracy = (this.matchCounter/this.attempts * 100).toFixed(0);
        return this.accuracy;
    };

    //Resets all the stats back to its original state and flips the cards over
    this.resetStats = function() {
        this.cardList = [];
        this.matchCount = 0;
        this.matchCounter = 0;
        this.attempts = 0;
        this.accuracy = 0;
        this.displayStats();
        this.resetGame();
    };

    // Resets Game
    this.resetGame = function() {
        $('.flip-container').removeClass('flipped');
        setTimeout( () => {
            $('#game-container-easy').html('');
            this.createCards(this.shuffleCards());
        }, this.revertTime);
    }

    //Handles the reset button
    this.handleReset = function () {
        var $resetButton = $('.fa-refresh');
        $resetButton.addClass('easyReset');
        $('.easyReset').click(this.resetStats.bind(this));
    };

    // Go to next level medium
    this.easyLevelChange = function() {
        setTimeout( () => {
            this.resetStats();
            $('#game-container-easy').css('display', 'none');
            $('#game-container-medium').css('display', 'flex');
            $(".level").text('Medium');
        }, this.revertTime);
    }

    // Click Handler to open game instructions modal
    this.handleModalInfo = function() {
        $('.fa-info').click(this.showModalInfo.bind(this));
    }

    // Game instructions displays in Modal
    this.showModalInfo = function() {
        $('#modal-shadow').show();
        $('#modal-content').show();
        $('#modal-body > img').attr('src', 'assets/images/info.gif');
        $('#modal-header > h1').text('Instructions');
        $('#button > p').text('start game');
        $('#main-container').css('filter', 'blur(3px)');
    }

    //Show Modal
    this.showModal = function() {
        setTimeout( () => {
            $('#modal-shadow').show();
            $('#modal-content').show();
            $('#modal-header>h1').text('First Level Complete!');
            $('#modal-body > img').attr('src', 'assets/images/victory.gif');
            $('#button > p').text('continue');
            $('#main-container').css('filter', 'blur(3px)');
        }, 500);
    }

    // Close Modal
    this.closeModal = function() {
        $('#modal-shadow').hide();
        $('#modal-content').hide();
        $('#main-container').css('filter', 'none');
    }

    //Close Modal on continue button click
    this.handleModal = function() {
        $("#button").click(this.closeModal.bind(this));
    };

    //Remove volume-up font awesome class and replace with volume-down
    this.handleAudioPlay = function() {
        $('.volume-container').on('click', '.fa-volume-up', function() {
            $(this).removeClass('fa-volume-up');
            $(this).addClass('fa-volume-down');
        });
    };

    //Remove volume-down font awesome class and replace with volume-up
    this.handleAudioStop = function() {
        $('.volume-container').on('click', '.fa-volume-down', function() {
            $(this).addClass('fa-volume-up');
            $(this).removeClass('fa-volume-down');
        });
    }

    //Remove card from the DOM on match
    this.handleCardMatch = function() {
        $('.flipped > .front').fadeTo(this.revertTime, 0, function() {
            $('.revealed').off('click');
        });
    }

    //Play sound on card hover
    this.handleElementHover = function() {
        $('.card, .fa, #button').mouseover( () => {
            this.soundList.blop.play();
        });
    }
}