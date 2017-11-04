function Card(parentObj, frontImage) {
    this.parent = parentObj;
    this.frontImage = frontImage;

    //Creates the DOM elements for the card deck and is instantiated in the Game object
    this.render = function() {
        var card = $('<div>',{
            class: 'card'
        });
        var flipContainer = $('<div>',{
            class: 'flip-container'
        });
        var front = $('<div>',{
            class: 'front',
            css: {
                backgroundImage: 'url('+this.frontImage+')',
            }
        });
        var back = $('<div>',{
            class: 'back'
        });
        card.append(flipContainer);
        flipContainer.append(front, back);
        card.click(this.handleClick.bind(this));
        this.flipContainer = flipContainer;
        this.card = card;
        return card;
    };

    //Handles the cards clicked and updates the stats
    this.handleClick = function() {
        this.parent.handleCardClick(this);
        this.parent.updateStats();
    };
    
    //Hides the back of the card, and adds the flip class for animation
    this.revealSelf = function() {
        this.flipContainer.toggleClass('flipped');
        this.card.toggleClass('revealed');
    };

    //Shows the back of the card and removes the flip animation 
    this.hideSelf = function() {
        this.flipContainer.removeClass('flipped');
        this.card.removeClass('revealed');
    };

    //Targets the front image
    this.getID = function() {
      return this.frontImage;
    };
}