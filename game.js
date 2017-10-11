function MemoryMatchGame() {
    this.cardList = [];
    this.matchCount = 0;
    this.matchCounter = 0;
    this.attempts = 0;
    this.gamesPlayed = 0;
    this.accuracy = 0;
    this.revertTime = 3000;
    this.imageList = [
        'assets/images/front1.png',
        'assets/images/front2.png',
        'assets/images/front3.png',
        'assets/images/front4.png',
        'assets/images/front5.png',
        'assets/images/front6.png',
        'assets/images/front7.png',
        'assets/images/front8.png',
        'assets/images/front9.png',
    ];
    this.clickedCardsList = [];

    //Initializes when the page loads
    this.initGame = function () {
        this.createCards(this.shuffleCards());
        this.handleResetClick();
        this.updateStats();
        this.handleAudioPlay();
        this.handleAudioStop();
    };

    //Randomizes the cards in the array
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

    //Creates the cards in the deck and instantiates the cards from the DOM
    this.createCards = function(images){
        for(var i = 0; i < images.length; i++){
            var newCard = new Card(this, images[i]);
            var cardElement = newCard.render();
            $('#gameArea').append(cardElement);
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
        setTimeout(this.hideModal.bind(this), this.revertTime);
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

    this.updateStats = function () {
        this.displayStats();
    }

    //Displays the stats on the DOM
    this.displayStats = function() {
        $("#gamesPlayed").text(this.gamesPlayed);
        $("#attempts").text(this.attempts);
        $("#accuracy").text(this.accuracy);
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
    this.handleResetClick = function () {
        var $resetButton = $('.fa-refresh');
        $resetButton.click(this.resetStats.bind(this));
    };

    //Targets and shows the victory modal
    this.showModal = function() {
        $("#myModal").modal('show');
    }

    //Targets and hides the victory modal
    this.hideModal = function() {
        $("#myModal").modal('hide');
    };

    //Appends an audio tag to the DOM when the audio on button is clicked
    this.handleAudioPlay = function() {
        $('.fa-volume-up').on('click', function(){
            $("<audio></audio>").attr({
                'src':'assets/images/audio.mp3',
                'autoplay':'autoplay'
            }).appendTo(".volume");
        });
    };

    //Removes the audio tag from the DOM when the off button is clicked
    this.handleAudioStop = function() {
        $('.fa-volume-off').on('click', function(){
            $(".volume").children("audio").remove();
        });
    }
}