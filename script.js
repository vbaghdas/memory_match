/**
 * Created by vachebaghdassarian on 7/27/17.
 */

// When page is loaded execute events below //

$(document).ready(apply_event_handlers);

function apply_event_handlers(){
    $('.card').on('click', function(){
        card_clicked(this);
        display_stats();
    });

    $('.back').css("display", "none");

    // Stat Audio //

    var timer;
    var elapsed = 0;
    var hasBeenClicked = false;

    $('.glyphicon-volume-up').on('click', function(){
        $("<audio></audio>").attr({
            'src':'assets/theme.mp3',
            'volume':0.4,
            'autoplay':'autoplay'
        }).appendTo("body");
    });

    // Stop Audio //

    $('.glyphicon-volume-off').on('click', function(){
        $("body").children("audio").remove();
    });

    // Start Game and Timer //

    $('.btn-success').on('click', function(){
        $('.btn-success').attr('data-toggle', 'modal');
        $('.btn-success').attr('data-target', '#fightModal');
        timer = setInterval(function(){
            $("#time").html(elapsed);
            if (elapsed == 0 || hasBeenClicked === true){
                elapsed = 99;
                hasBeenClicked = false;
            } else {
                elapsed -= 1;
            }
        },1000);
    });

    // Reset Stats Button //

    $('.btn-danger').on('click', function(){
        ++games_played;
        reset_stats();
        display_stats();
        $('.front').css('visibility', 'visible');
        hasBeenClicked = true;
    });

}

// Card Flip Function //

var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;
var matches = 0;
var attempts = 99;
var accuracy = 0;
var games_played = 0;

function card_clicked(card) {
    $(card).find('.front').fadeOut();
    $(card).find('.back').css("display", "block");
    if (first_card_clicked === null) {
        first_card_clicked = card;
        return;
    } else {
        second_card_clicked = card;
        if ($(first_card_clicked).find('.back > img').attr('src') === $(second_card_clicked).find('.back > img').attr('src')) {
            ++matches;
            --attempts;
            accuracy = parseInt(matches/attempts * 100);
            ++match_counter;
            first_card_clicked = null;
            second_card_clicked = null;
            if (match_counter === total_possible_matches) {
                $('.front').attr('data-toggle', 'modal');
                $('.front').attr('data-target', '#winModal');
            } else {
                return;
            }
        } else {
            --attempts;
            accuracy = parseInt(matches/attempts * 100);
            $('.card').off('click');
            setTimeout(function(){
                $('.card').on('click', function(){
                    card_clicked(this);
                    display_stats();
                });
                $(first_card_clicked).find('.back').hide();
                $(second_card_clicked).find('.back').hide();
                $(first_card_clicked).find('.front').show();
                $(second_card_clicked).find('.front').show();
                first_card_clicked = null;
                second_card_clicked = null;
            },2000);
            return;
        }

    }
}

// Statistics Function //

// Display Stats //

function display_stats(){
    $('#games-played > .value').text('Games Played: ' + games_played);
    $('#attempts > .value').text('Attempts:  ' + attempts);
    $('#accuracy > .value').text('Accuracy:  ' + accuracy + '%');

    $(function() {
        $("#games-played").progressbar({
            value: games_played
        });

        $("#attempts").progressbar({
            value: attempts
        });

        $("#accuracy").progressbar ({
            value: accuracy
        });
    } );
}

// Reset Stats //

function reset_stats(){
    accuracy = 0;
    matches = 0;
    attempts = 0;
    display_stats();
}