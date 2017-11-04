function HardGame() {
    this.cardList = [];
    this.matchCount = 0;
    this.matchCounter = 0;
    this.attempts = 0;
    this.gamesPlayed = 0;
    this.accuracy = 0;
    this.revertTime = 1500;
    this.imageList = [
        'assets/images/hard/front1.jpg',
        'assets/images/hard/front2.jpg',
        'assets/images/hard/front3.jpg',
        'assets/images/hard/front4.jpg',
        'assets/images/hard/front5.jpg',
        'assets/images/hard/front6.jpg',
        'assets/images/hard/front7.jpg',
        'assets/images/hard/front8.jpg',
        'assets/images/hard/front9.jpg',
        'assets/images/hard/front10.jpg',
        'assets/images/hard/front11.jpg',
        'assets/images/hard/front12.jpg',
    ];
    this.clickedCardsList = [];

    //Initializes when the page loads
    this.initGame = function () {
        this.createCards(this.shuffleCards());
        this.handleReset();
        this.updateStats();
        this.handleModal();
        this.handleAudioPlay();
        this.handleAudioStop();
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
            $("#game-container-hard").append(cardElement);
            this.cardList.push(newCard);
        }
        return this.cardList;
    };

    //Handles game logic, statistics counter, and reverts cards if there is no match
    this.handleCardClick = function(cardObj) {
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
                    this.handleCardFlipped();

                    if(this.matchCount === this.cardList.length){
                        this.playerWins();
                    }
                }
                else {
                    this.attempts++;
                    this.calculateAccuracy();
                    setTimeout(this.revertClickedCards.bind(this), this.revertTime);
                }
            }
        }
    
    //Win handler runs when all cards are matched and targets victory modal
    };
    this.playerWins = function() {
        this.gamesPlayed++;
        this.showModal();
    };

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
        $("#games-played").text(this.gamesPlayed);
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
        this.matchCount = 0;
        this.matchCounter = 0;
        this.attempts = 0;
        this.gamesPlayed++;
        this.accuracy = 0;
        this.displayStats();
        $('.card').find('.back').show();
        $('.card').removeClass('flipped');
    };

    //Handles the reset button
    this.handleReset = function () {
        var $resetButton = $('.fa-refresh');
        $resetButton.click(this.resetStats.bind(this));
    };

    //Show Modal
    this.showModal = function() {
        $('#modal-shadow').show();
        $('#modal-content').show();
        $('#main-container').css('filter', 'blur(2px)');
    }

    // Close Modal
    this.closeModal = function() {
        $('#modal-shadow').hide();
        $('#modal-content').hide();
        $('#main-container').css('filter', 'none');
    }

    //Click handler will close Modal on shadow and button click.
    this.handleModal = function() {
        $("#modal-shadow").click(this.closeModal.bind(this));
        $("#modal-content").click(this.closeModal.bind(this));
    };

    //Appends an audio tag to the DOM when the audio on button is clicked
    this.handleAudioPlay = function() {
        $('.volume-container').on('click', '.fa-volume-up', function(){
            $(this).removeClass('fa-volume-up');
            $(this).addClass('fa-volume-down');
            $("<audio>").attr({
                'src':'./assets/audio.mp3',
                'autoplay':'autoplay'
            }).appendTo(".volume-container");
        });
    };

    //Removes the audio tag from the DOM when the off button is clicked
    this.handleAudioStop = function() {
        $('.volume-container').on('click', '.fa-volume-down', function(){
            $(".volume-container").children("audio").remove();
            $(this).addClass('fa-volume-up');
            $(this).removeClass('fa-volume-down');
        });
    }

    //Remove card from the DOM on match
    this.handleCardFlipped = function() {
        $('.flipped > .front').fadeOut(2000, function() {
            $('.revealed').off('click');
        });
    }
}