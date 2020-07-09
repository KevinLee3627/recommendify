//RECOMMENDING
// Sending request to server (searchForItem)
// Parsing spotify data, showing results (displaySearchResults, showTrack/Album/ArtistSearchResults)
// Getting user recommendation
//	--> prompting them to explore rest of site (.search-results-container onclick)
//	--> give recommendation data to server

//NOTES
	//figure out how to display more search results when the first 10 aren't enough
	//maybe just raise the limit?
$('.rec-something a').click((e) => {
  $('.rec-flag').removeClass('rec-flag');
  $(e.target).addClass('rec-flag');
})

$('.rec-input').keyup( (e) => {
  if (e.which === 13) {
    let query_text = encodeURI(e.target.value);
    let type = $('.rec-flag')[0].attributes.getNamedItem('data-search-type').value;
    const limit = 10; //figure this out later
    searchForItem(query_text, type, limit)
  }
})

function searchForItem(query, type, limit) {
  const endpoint = '/api/search';
  let data = {
    query: query,
    type: type,
    limit: limit
  }
  axios.post('/api/search', {
      data: data
  }).then( res => {
    for (result_type in res.data) {
      let results = res.data[result_type]
      //result_type is given in the plural form, turn to singular
      result_type = result_type.slice(0, -1)
			console.log(results);
      displaySearchResults(results.items)
    }
  }).catch( err => {
    console.log(err);
  })
}

$('.search-results-container').on('click', '.search-result', function(e) {
  let elem = $(this);
  let chosen_result = $(elem[0]);
	let fade_speed = 300;
	$('.rec-text, .rec-something, .rec-input, .search-results-container').fadeOut(fade_speed);
	chosen_result.fadeOut(fade_speed);
	chosen_result.delay(fade_speed).queue('fx', () => {
		chosen_result.addClass('search-result-chosen').appendTo('.landing-container');
		chosen_result.fadeIn(fade_speed);
		chosen_result.after(`<p class='landing-thank-you'>Thank you for sharing!</p>`).fadeIn(400);
		$('.landing-explore-container, .landing-thank-you').fadeIn(fade_speed);
		chosen_result.dequeue();
		$('.rec-text, .rec-something, .rec-input, .landing-container > .search-results-container').remove();
	})
	console.log(chosen_result.data());
	axios.post('/api/recommend', {
		data: chosen_result.data()
	}).catch( err => console.log(err))

})
