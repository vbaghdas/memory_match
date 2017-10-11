function Card(parentObj, frontImage) {
    this.frontImage = frontImage;
    this.parent = parentObj;
    this.renderedElement = null;

    //Creates the DOM elements for the card deck and is instantiated in the Game object
    this.render = function() {
        var card = $('<div>',{
            class: 'card'
        });
        card.click(this.handleClick.bind(this));
        var front = $('<div>',{
            class: 'front',
            css: {
                backgroundImage: 'url('+this.frontImage+')',
            }
        });
        var back = $('<div>',{
            class: 'back img-rounded'
        });
        card.append(front, back);
        this.renderedElement = card;
        return card;
    };

    //Handles the cards clicked
    this.handleClick = function() {
        this.parent.handleCardClick(this);
        game.updateStats();
    };
    
    //Hides the back of the card, and adds the flip class for animation
    this.revealSelf = function() {
        this.renderedElement.find('.back').hide();
        this.renderedElement.toggleClass('flipped');
    };

    //Shows the back of the card and removes the flip animation 
    this.hideSelf = function() {
        this.renderedElement.find('.back').show();
        this.renderedElement.removeClass('flipped');
    };

    //Targets the front image for identification
    this.getID = function() {
      return this.frontImage;
    };
}