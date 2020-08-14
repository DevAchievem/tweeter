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

  const timeSince = (date) => {

    const seconds = Math.floor((new Date() - date) / 1000);
  
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  };
  
  let aDay = 24 * 60 * 60 * 1000;
  console.log(timeSince(new Date(Date.now() - aDay)));
  console.log(timeSince(new Date(Date.now() - aDay * 2)));

  const createTweetElement = (search) => {
    const safeHTML = escape(search.content.text);
    const userName = search.user.name;
    const userPic = search.user.avatars;

    const dateNow = moment();
    const timeElapsed = timeSince(dateNow);
    // console.log("date: ", dateNow);
    console.log("timeelapsed: ", timeElapsed);
    const $tweet = `<article class="user-tweets">
		<header class="name-of-tweeter">
			<div class="face-and-name">
				<img src='${userPic}'></img>
				<span class="name">${userName}</span>
			</div>
		</header>
		<main class="max-width">
		<p class="tweeted-text break-long-words">${safeHTML}</p>
		</main>
		<footer class="tweet-footer">
			<small id="timeago">${timeElapsed}</small>
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
  

  // BUTTON SLIDES:
  $(window).scroll(function() {
    const scroll = $(window).scrollTop();
    if (scroll >= 1) {
      $('.call-to-action').slideUp(500);
      $('.back-to-top').slideDown(500);
      $('.tweeter').slideUp(500);
      $('.fa-earlybirds').fadeIn(1500);

    } else {
      $('.call-to-action').slideDown(500);
      $('.back-to-top').slideUp(0);
      $('.tweeter').fadeIn(500);
      $('.fa-earlybirds').css('display', 'none');
    }

  });
  
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const tweeted = createTweetElement(tweet);
      $tweetsContainer.prepend(tweeted).load('/localhost:8080/');
    }
  };

  const loadTweets = function() {
    $.getJSON('/tweets', function(data) {
      renderTweets(data);
    });
  };


  // for posting tweets, fetching them and sending to the DOM
  const $form = $('#tweet-form');

  $form.on('submit', (event) => {

    event.preventDefault();

    const text = jQuery('textarea#tweet-text').val();
    const serialized = $form.serialize();
    $($tweetsContainer).empty();
    if (text.length === 0) {
      $('#errorNoText').css('display', 'inline');
      $('button[type=submit]').prop('disabled', true);
      $('.closebtn').click(function() {
        $('#errorNoText').css('display', 'none');
      });
      
    } else if (text.length >= 140) {
      $('#errorTextTooLong').css('display', 'inline');
      $('button[type=submit]').prop('disabled', true);
      $('.closebtn').click(function() {
        $('#errorTextTooLong').css('display', 'none');
      });
    } else {
      $.post('/tweets', serialized)
        .then((tweet) => {
          createTweetElement(tweet);
          // $('#timeAgo').append(`<small>${timeElapsed}</small`);
        });
      loadTweets();
    }
  });
  loadTweets();


});
