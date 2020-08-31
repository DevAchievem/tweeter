// $(document).ready(function() {

//SAME AS ABOVE:

$(() => {

  // click to slidedown the tweet posting textarea
  $('.call-to-action').on('click', function() {
    if ($('#new-tweet').is(':hidden')) {
      ($('#new-tweet').slideDown(1000));
    } else {
      ($('#new-tweet').slideUp(1000));
    }
  });

  
  const $tweetsContainer = $('#tweets-container');

  // anti hacking function
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createTweetElement = (search) => {
    const safeHTML = escape(search.content.text);
    const userName = search.user.name;
    const userPic = search.user.avatars;

    const timeCreated = search.created_at;
    const timeElapsed = moment(timeCreated).toNow(true);
    const $tweet = `<article class="user-tweets">
		<header class="name-of-tweeter">
			<div class="face-and-name hover-blur">
				<img src='${userPic}'></img>
				<span class="name">${userName}</span>
			</div>
		</header>
		<main class="max-width">
		<p class="tweeted-text break-long-words hover-blur">${safeHTML}</p>
		</main>
		<footer class="tweet-footer">
			<small class="hover-blur" id="timeago">${timeElapsed}</small>
			<ul class="icons">
				<li class="icon-div"><a href=""><i class="fas fa-flag"></i></a></li>
				<li class="icon-div"><a href=""><i class="fas fa-retweet"></i></a></li>
				<li class="icon-div"><a href=""><i class="fas fa-heart"></i></a></li>
			</ul>
		</footer>

		</article>
	`;

    return $tweet;
  };
  

  // BUTTON SLIDERS:
  $(window).scroll(function() {
    const scroll = $(window).scrollTop();
    if (scroll >= 1) {
      $('.call-to-action').slideUp(500);
      $('.back-to-top').slideDown(500);
      $('.fa-earlybirds').fadeIn(1500);
      if (window.innerWidth > 768) {
        $('nav').css('background-color', '#4056A1');
      }
    } else {
      $('.call-to-action').slideDown(500);
      $('.back-to-top').slideUp(0);
      $('.fa-earlybirds').css('display', 'none');
      if (window.innerWidth < 768) {
        $('nav').css('background-color', 'transparent');
      }
    }

  });
  
  const renderTweets = function(tweets) {
    let tweetsContainer = $('#tweets-container').html('');
    tweets.forEach(function(tweet) {
      let tweetElement = createTweetElement(tweet);
      tweetsContainer.prepend(tweetElement);
    });
    // for (const tweet of tweets) {
    //   const tweeted = createTweetElement(tweet);
    //   $tweetsContainer.prepend(tweeted);
    // }
  };

  const loadTweets = function() {
    $.getJSON('/tweets', function(data) {
      $('.tweets').empty();
      $('textarea').val('');
      renderTweets(data);

    });
  };


  // for posting tweets, fetching them and sending to the DOM
  const $form = $('#tweet-form');

  $form.on('submit', (event) => {

    event.preventDefault();

    const text = jQuery('textarea#tweet-text').val();
    const serialized = $form.serialize();
    // $($tweetsContainer).empty();
    if (text.length === 0) {
      $('#errorNoText').slideDown(500);
      // $('button[type=submit]').prop('disabled', true);
      $('.closebtn').click(function() {
        $('#errorNoText').slideUp(500);
      });
        
    } else if (text.length > 140) {
      $('#errorTextTooLong').slideDown(500);
      // $('button[type=submit]').prop('disabled', true);
      $('.closebtn').click(function() {
        $('#errorTextTooLong').slideUp(500);
      });

    } else {
      $.post('/tweets', serialized)
        .then(() => {
          $('#errorTextTooLong').slideUp(500);
          $('#errorNoText').slideUp(500);
          loadTweets();
        });
    }
  });
  loadTweets();


});
