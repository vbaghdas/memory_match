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

    // Reset Stats Button //

    $('.fa-refresh').on('click', function(){
        ++games_played;
        reset_stats();
        display_stats();
    });

    $('.back').css('display', 'none');
}

// Card Flip Function //

var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;
var matches = 0;
var attempts = 0;
var accuracy = 0;
var games_played = 0;

function card_clicked(card) {
    $(card).addClass('flipped');
    $(card).find('.front').hide();
    $(card).find('.back').css("display", "block");
    if (first_card_clicked === null) {
        first_card_clicked = card;
        return;
    } else {
        second_card_clicked = card;
        if ($(first_card_clicked).find('.back > i').attr('class') === $(second_card_clicked).find('.back > i').attr('class')) {
            ++matches;
            ++attempts;
            accuracy = parseInt(matches/attempts * 100);
            ++match_counter;
            first_card_clicked = null;
            second_card_clicked = null;
            if (match_counter === total_possible_matches) {
                $('.front').attr('data-target', '#winModal');
            } else {
                return;
            }
        } else {
            ++attempts;
            accuracy = parseInt(matches / attempts * 100);
            $('.card').off('click');
            setTimeout(function(){
                $(first_card_clicked).removeClass("flipped");
                $(second_card_clicked).removeClass("flipped");
                setTimeout(function () {
                    $('.card').on('click', function () {
                        card_clicked(this);
                        display_stats();
                    });
                    $(first_card_clicked).find('.back').hide();
                    $(second_card_clicked).find('.back').hide();
                    $(first_card_clicked).find('.front').show();
                    $(second_card_clicked).find('.front').show();
                    first_card_clicked = null;
                    second_card_clicked = null;
                }, 250);
            }, 1000);
        }
    }
}

// Statistics Function //

// Display Stats //

function display_stats(){
    $('#games-played').text(games_played);
    $('#attempts').text(attempts);
    $('#accuracy').text(accuracy + '%');
}

// Reset Stats //

function reset_stats(){
    accuracy = 0;
    matches = 0;
    attempts = 0;
    display_stats();
    $(".card").removeClass("flipped");
    $('.card').find('.back').hide();
    $('.card').find('.front').show();
}