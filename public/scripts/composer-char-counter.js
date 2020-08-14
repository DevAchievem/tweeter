$(document).ready(function() {
  $('#tweet-text').mouseenter(function() {
    $(this).css("background-color", "#4056A1");
    $(this).css("color", "white");
  });
  $('#tweet-text').mouseleave(function() {
    $(this).css("background-color", "#f4f1ec");
    $(this).css("color", "#545149");
  });
    
  // https://github.com/6thSigma/twitter-char-counter/blob/master/char-count.js

  $(document).on('keyup keydown', '#tweet-text', function(e) {
	
    // Lengths
    let maxLen = 140;
    let warnLen = 10;
    
    // Colors
    let defaultTextColor = {'color': ''};
    let warnTextColor = {'color': 'red'};
    let negTextColor = {'color': 'DarkRed'};
    
    let charsLeft = maxLen - $(this).val().length;
    if (charsLeft > warnLen) {
      $('#tx-counter').html(charsLeft).css(defaultTextColor);
      $('#errorTextTooLong').css('display', 'none');
    } else if (charsLeft > 0) {
      $('#tx-counter').html(charsLeft).css(warnTextColor);
      $('#errorTextTooLong').css('display', 'none');
    } else {
      $('#tx-counter').html(charsLeft).css(negTextColor);
    }
  });
});