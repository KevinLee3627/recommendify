$('.landing-down-arrow').on('click', (e) => {
	//1. Show 'main' wrapper
		//a. this includes sorting options
	$('.landing-wrapper')
		.slideUp(600)
		.fadeOut({
		duration: 600,
		queue: false
	}).queue('fx', () => {
		$('.landing-wrapper').remove();
	})
	$('.main-wrapper').show();
	$('.search-results-container').show();
	$('.search-results-container').off('click')
	//2. Make api call to get random results (how many?)
	getSortResults('/api/sort')
})

$('.slide-arrow').on('click', e => {
	$('.sort-container__body').slideToggle(300);
})

function getSortResults(endpoint) {
	axios.get(endpoint)
		.then( res => {
			console.log(res.data);
			displaySearchResults(res.data);
			$('.search-result:not(.search-result-chosen)').each( (i, elem) => {
				$(elem).prepend(`<span class='num-recs'>${elem.dataset.recs}</span>`)
			})
		})
}
$('input[type="radio"]').on('click', e => {
	console.log('radio clicked');
	let type_sort_val = encodeURIComponent($('input[name="sort-type"]:checked')[0].value);
	let date_sort_val = encodeURIComponent($('input[name="sort-date"]:checked')[0].value);
	getSortResults(`/api/sort?type=${type_sort_val}&date=${date_sort_val}`)
})

// $('.main-wrapper').show();
