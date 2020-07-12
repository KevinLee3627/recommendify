//RECOMMENDING
// Sending request to server (searchForItem)
// Parsing spotify data, showing results (displaySearchResults, showTrack/Album/ArtistSearchResults)
// Getting user recommendation
//	--> prompting them to explore rest of site (.search-results-container onclick)
//	--> give recommendation data to server


/*
███████ ███████  █████  ██████   ██████ ██   ██
██      ██      ██   ██ ██   ██ ██      ██   ██
███████ █████   ███████ ██████  ██      ███████
     ██ ██      ██   ██ ██   ██ ██      ██   ██
███████ ███████ ██   ██ ██   ██  ██████ ██   ██
*/

$('.rec-something a').click((e) => {
  $('.rec-flag').removeClass('rec-flag');
  $(e.target).addClass('rec-flag');
})

$('.rec-input').keyup( (e) => {
	$('.skip-rec-container').fadeOut(400);
  if (e.which === 13) {
    let query_text = encodeURI(e.target.value);
    let type = $('.rec-flag')[0].attributes.getNamedItem('data-search-type').value;
		console.log(type);
    const limit = 25
    searchForItem(query_text, type, limit)
  }
})

function searchForItem(query, type, limit) {
  const endpoint = '/api/search';
  let data = {
    query: query,
    type: type,
    limit: limit,
  }
  axios.post('/api/search', {
      data: data
  }).then( res => {
		for (type in res.data) {
			displaySearchResults(res.data[type].items)
		}
  }).catch( err => {
    console.log(err);
  })
}

/*
██████  ███████  ██████  ██████  ███    ███ ███    ███ ███████ ███    ██ ██████
██   ██ ██      ██      ██    ██ ████  ████ ████  ████ ██      ████   ██ ██   ██
██████  █████   ██      ██    ██ ██ ████ ██ ██ ████ ██ █████   ██ ██  ██ ██   ██
██   ██ ██      ██      ██    ██ ██  ██  ██ ██  ██  ██ ██      ██  ██ ██ ██   ██
██   ██ ███████  ██████  ██████  ██      ██ ██      ██ ███████ ██   ████ ██████
*/

$('.search-results-container').on('click', '.search-result', function(e) {
  let elem = $(this);
  let chosen_result = $(elem[0]);
	let fade_speed = 300;
	$('.rec-container, .search-results-container').fadeOut(fade_speed);
	chosen_result.fadeOut(fade_speed);
	chosen_result.delay(fade_speed).queue('fx', () => {
		$('.landing-container').append(`<div class='chosen-container'></div>`);
		chosen_result.addClass('search-result-chosen').appendTo('.chosen-container');
		chosen_result.fadeIn(fade_speed);
		chosen_result.after(`<p class='landing-thank-you'>Thank you for sharing!</p>`).fadeIn(400);
		$('.landing-explore-container, .landing-thank-you').fadeIn(fade_speed);
		chosen_result.dequeue();
		$('.rec-container, .landing-container > .search-results-container').remove();
	})
	// console.log(chosen_result.data());
	axios.post('/api/recommend', {
		data: chosen_result.data()
	}).catch( err => console.log(err))
})


/*

█████ █████ █████ █████ █████ █████ █████
*/
