function Responsive() {
    this.currentWindowWidth = null;
    this.currentWindowHeight = null;
    this.containerW = null;
    this.containerH = null;
    this.mainContainerW = null;
    this.mainContainerH = null;
    this.containerR = null;
    this.newWidth = null;
    this.newHeight = null;
    this.newTop = null;

    this.initRes = function () {
        this.getWindowSize();
        this.setContainer();

        $(window).resize( () => {
            this.getWindowSize();
            this.setContainer();
        });
    }

    this.getWindowSize = function() {
        this.currentWindowWidth = window.innerWidth ? window.innerWidth : $(window).width();
        this.currentWindowHeight = window.innerHeight ? window.innerHeight : $(window).height();
    }

    this.setContainer = function() {
        if (!this.containerW) {
            this.containerW = $('#main-container').attr('data-width');
        }
        if (!this.containerH) {
            this.containerH = $('#main-container').attr('data-height'); 
        }

        // landscape
        if (this.currentWindowWidth > this.currentWindowHeight) { 
            this.containerR = this.containerW / this.containerH;
            
            $('body').addClass('right');
            $('body').removeClass('top');
            
            $('#right-container').show();
            $('#top-container').hide();  
        }

        // portrait
        else {
            this.containerR = this.containerH / this.containerW;

            $('body').addClass('top');
            $('body').removeClass('right');
            
            $('#right-container').hide();
            $('#top-container').show();  
        }

        this.newWidth = this.currentWindowHeight * this.containerR;
        if (this.newWidth > this.currentWindowWidth) {   
            this.newWidth = this.currentWindowWidth;
            this.newHeight = this.currentWindowWidth / this.containerR;
        
            if (this.newHeight > this.containerH){
                this.newWidth = this.containerH * this.containerR;;
                this.newHeight = this.containerH;
            }

            $('#main-container').width(this.newWidth);
            $('#main-container').height(this.newHeight); 
            
            this.mainContainerW = this.newWidth;
            this.mainContainerH = this.newHeight;
            
            this.newTop = this.newHeight / 2;
            $('#main-container').css('margin-top', '-'+this.newTop+'px');
            $('#main-container').css('margin-left', '-'+this.newWidth/2+'px');
        }
        else {            
            this.newWidth = this.currentWindowHeight * this.containerR;
            this.newHeight = this.currentWindowHeight;
            
            if (this.newWidth > this.containerW){
                this.newWidth = this.containerW;
                this.newHeight = this.containerW / this.containerR;
            }
            
            $('#main-container').width(this.newWidth);
            $('#main-container').height(this.newHeight); 
            
            this.mainContainerW = this.newWidth;
            this.mainContainerH = this.newHeight;
            
            this.newTop = this.newHeight / 2;
            $('#main-container').css('margin-top', '-'+this.newTop+'px');        
            $('#main-container').css('margin-left', '-'+this.newWidth/2+'px');
        }

        $('body').height(this.currentWindowHeight);
    }
}