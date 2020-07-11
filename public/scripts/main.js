$('.landing-down-arrow').on('click', (e) => {
	//1. Show 'main' wrapper
		//a. this includes sorting options
	$('.landing-wrapper')
		.slideUp(600)
		.fadeOut({
		duration: 600,
		queue: false
	}).queue('fx', () => {
		// $('.landing-wrapper').remove();
	})
	$('.main-wrapper').show();
	$('.search-results-container').show();
	$('.search-results-container').off('click');
	//Makes sure default results are songs in the last week
	$('input[value="track"], input[value="week"]').prop('checked', true)
	getSortResults('/api/sort?type=track&date=week');
})

$('.slide-arrow').on('click', e => {
	$('.sort-container__body').slideToggle(300);
})

/*----------------------*/
/*-------SORTING--------*/
/*----------------------*/

function getSortResults(endpoint) {
	axios.get(endpoint)
		.then( res => {
			console.log(res.data);
			displaySearchResults(res.data);
			$('.search-result:not(.search-result-chosen)').each( (i, elem) => {
				$(elem).prepend(`<span class='num-recs'>${elem.dataset.recs}</span>`);
			})
		})
}

$('input[type="radio"]').on('click', e => {
	console.log('radio clicked');
	let type_sort_val = encodeURIComponent($('input[name="sort-type"]:checked')[0].value);
	let date_sort_val = encodeURIComponent($('input[name="sort-date"]:checked')[0].value);
	getSortResults(`/api/sort?type=${type_sort_val}&date=${date_sort_val}`);
})

/*----------------------*/
/*-------SHUFFLE--------*/
/*----------------------*/

$('.shuffle-button').on('click', e => {
	console.log('shuffle clicked');
	let type_sort_val = encodeURIComponent($('input[name="sort-type"]:checked')[0].value);
	getSortResults(`/api/shuffle?type=${type_sort_val}`)
})
