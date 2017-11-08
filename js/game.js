function Game() {
    this.matchCount = 0;
    this.matchCounter = 0;
    this.attempts = 0;
    this.accuracy = 0;
    this.revertTime = 2000;
    this.soundDelay = 500;
    this.cardList = [];
    this.clickedCardsList = [];
    this.currentGame = 0;
    this.imageListEasy = [
        'assets/images/easy/front1.jpg',
        'assets/images/easy/front2.jpg',
        'assets/images/easy/front3.jpg',
        'assets/images/easy/front4.jpg',
        'assets/images/easy/front5.jpg',
        'assets/images/easy/front6.jpg',
        'assets/images/easy/front7.jpg',
        'assets/images/easy/front8.jpg',
    ];
    this.imageListMedium = [
        'assets/images/medium/front1.jpg',
        'assets/images/medium/front2.jpg',
        'assets/images/medium/front3.jpg',
        'assets/images/medium/front4.jpg',
        'assets/images/medium/front5.jpg',
        'assets/images/medium/front6.jpg',
        'assets/images/medium/front7.jpg',
        'assets/images/medium/front8.jpg',
        'assets/images/medium/front9.jpg',
        'assets/images/medium/front10.jpg',
    ];
    this.imageListHard = [
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
    this.gameTypes = [
        this.imageListEasy,
        this.imageListMedium,
        this.imageListHard
    ];
    this.gameContainers = [
        'easy-container',
        'medium-container',
        'hard-container'
    ];
    this.level = [
        'Easy',
        'Medium',
        'Hard'
    ];
    this.soundList = {
        'intro' : new Audio("assets/sounds/intro.mp3"),
        'blop' : new Audio("assets/sounds/blop.mp3"),
        'flop' : new Audio("assets/sounds/flop.mp3"),
        'match' : new Audio("assets/sounds/match.wav"),
        'wrong' : new Audio("assets/sounds/wrong.wav"),
        'victory' : new Audio("assets/sounds/victory.wav")
    };
    this.modalHeader = [
       'First Level Complete',
       'Second Level Complete',
       'WooHoo! You Did It!!'
    ];
    this.initGame = function () {
        this.createCards( this.shuffleCards(this.gameTypes[this.currentGame]) );
        this.handleReset();
        this.updateStats();
        this.handleInfoModal();
        this.handleCloseModal();
        this.handleAudioPlay();
        this.handleAudioStop();
        this.handleHoverSound();
    };

/*==========================================================

                Randomize Cards for All Decks

===========================================================*/
    this.shuffleCards = function (imageList) {
        var imageList = imageList.concat(imageList);
        var currentIndex = imageList.length, temp, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temp = imageList[currentIndex];
            imageList[currentIndex] = imageList[randomIndex];
            imageList[randomIndex] = temp;
        }
        return imageList;
    };

/*==========================================================

                Create Deck and Append to DOM

===========================================================*/
    this.createCards = function(imageList){
        for(var i = 0; i < imageList.length; i++){
            var newCard = new Card(this, imageList[i]);
            var cardElement = newCard.render();
            $('#game-container').append(cardElement);
            this.cardList.push(newCard);
        }
        return this.cardList;
    };

/*==========================================================

                Handle Card Click Logic

===========================================================*/
    this.handleCardClick = function(cardObj) {
        this.soundList.flop.play();
        if(this.clickedCardsList.length < 2){
            // if (this.clickedCardsList[0] == cardObj){
            //     return;
            // }
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
                    setTimeout( ()=>{ this.soundList.match.play() }, this.soundDelay);

                    if(this.matchCount === this.cardList.length){
                        this.soundList.victory.play();
                        this.victoryModal();
                        setTimeout( ()=>{ this.levelChange() }, this.revertTime);
                    }
                }
                else {
                    this.attempts++;
                    this.calculateAccuracy();
                    setTimeout( ()=>{ this.soundList.wrong.play() }, this.soundDelay);
                    setTimeout( this.revertClickedCards.bind(this), this.revertTime);
                }
            }
        }
    };

    this.clearClickedCardsList = function () {
        this.clickedCardsList = [];
    };

    this.revertClickedCards = function() {
        for(var i = 0; i < this.clickedCardsList.length; i++){
            this.clickedCardsList[i].hideSelf();
        }
        this.clearClickedCardsList();
    };

    this.handleCardMatch = function() {
        $('.flipped > .front').fadeTo(500, 0, function() {
            $('.revealed').off();
        });
    };

/*==========================================================

            Calculate and Display Statistics

===========================================================*/
    this.updateStats = function() {
        this.displayStats();
    };

    this.displayStats = function() {
        $(".attempts").text(this.attempts);
        $(".accuracy").text(this.accuracy);
    };

    this.calculateAccuracy = function() {
        this.accuracy = (this.matchCounter/this.attempts * 100).toFixed(0);
        return this.accuracy;
    };

    this.resetStats = function() {
        this.matchCount = 0;
        this.matchCounter = 0;
        this.attempts = 0;
        this.accuracy = 0;
        this.cardList = [];
        this.displayStats();
        this.clearClickedCardsList();
    };

    this.resetGame = function() {
        $("#game-container").html('');
        this.resetStats();
        this.createCards(this.shuffleCards(this.gameTypes[this.currentGame]));
    };
    
    this.handleReset = function() {
        $('.fa-refresh').click(this.resetGame.bind(this));
    };

/*==========================================================

                Level and Class Change

===========================================================*/
    this.levelChange = function() {
        this.currentGame = (this.currentGame + 1) % 3;
        $(".level").text(this.level[this.currentGame]);
        this.resetGame();
        this.classChange();
    };

    this.classChange = function() {
        $("#game-container").attr("class", this.gameContainers[this.currentGame]);
    };

/*==========================================================

                Modal Handle and Display

===========================================================*/
    this.victoryModal = function() {
        $('#modal-header > h1').text(this.modalHeader[this.currentGame]);
        $('#modal-body > img').attr('src', 'assets/images/victory.gif');
        $('#button > p').text('continue');
        this.showModal();
    };

    this.infoModal = function() {
        $('#modal-body > img').attr('src', 'assets/images/info.gif');
        $('#modal-header > h1').text('Instructions');
        $('#button > p').text('Start Game');
        this.showModal();
    };

    this.showModal = function() {
        $('#main-container').css('filter', 'blur(3px)');
        $('#modal-shadow').show();
        $('#modal-content').show();
    };

    this.closeModal = function() {
        $('#modal-shadow').hide();
        $('#modal-content').hide();
        $('#main-container').css('filter', 'none');
    };

    this.handleInfoModal = function() {
        $('.fa-info').click(this.infoModal.bind(this));
    };

    this.handleCloseModal = function() {
        $("#button").click(this.closeModal.bind(this));
    };

/*==========================================================

                Audio and Sound Handle

===========================================================*/
    this.handleAudioPlay = function() {
        $('.volume-container').on('click', '.fa-volume-up', () => {
            $('.fa-volume-up').attr('class', 'fa fa-volume-down');
            this.soundList.intro.play();
        });
    };

    this.handleAudioStop = function() {
        $('.volume-container').on('click', '.fa-volume-down', () => {
            $('.fa-volume-down').attr('class', 'fa fa-volume-up');
            this.soundList.intro.pause();
        });
    };

    this.handleHoverSound = function() {
        $('.card, .fa, #button').mouseover( () => {
            this.soundList.blop.play();
        });
    };
}