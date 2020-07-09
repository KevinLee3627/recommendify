function displaySearchResults(results) {
	console.log('running displaySearchResults');
  $('.search-result-container').remove();
  $('.search-result-spacer').remove();

	results.forEach((rec, i, results) => {
		//The data returned from api call to spotify returns objects
		//with their type encoded to rec.type, whereas the documents
		//returned from mongoDB have their type encoded to rec.obj_type,
		//so the line below makes sure that the type is retrieved
		//depending on the object (spotify api call or mongodb call).
		if (rec.obj_data) {
			results.forEach(rec => rec.obj_data.recs = rec.times_recommended)
			rec = rec.obj_data
		}
		// console.log(rec);
		switch (rec.type) {
	    case 'track':
				showTrackSearchResults(rec, i, results)
	      break;
	    case 'album':
	      showAlbumSearchResults(rec, i, results)
	      break;
	    case 'artist':
	      showArtistSearchResults(rec, i, results)
	      break;
	  }
	})
}

function showTrackSearchResults(track, i, results) {
  // console.log(track, i);
  let track_name = track.name;
  let artists = track.artists.map(artist => artist.name).join(', ');
  let album = `${track.album.name} (${track.album.release_date.slice(0,4)})`;
  let img_url = track.album.images[2].url; //[2] gives the smallest img (64x64px)
  let track_html = `
	<li class='search-result-container'>
		<button class='search-result spotify-track-${track.id}' data-recs='${track.recs}'>
    	<img src='${img_url}' class='result-img'>
    	<p class='track-result-name'><strong>${track.name}</strong></p>
    	<p class='track-result-artists'>by ${artists}</p>
    	<p class='track-result-album'><i>${album}</i></p>
  	</button>
	</li>`;
  $('.search-results-container').append(track_html);
	$(`.search-result.spotify-track-${track.id}`).data(track);
  if (i < results.length - 1) $('.search-results-container').append('<div class="search-result-spacer"></div>');
}

function showAlbumSearchResults(album, i, results) {
  // console.log(album);
  let album_name = album.name;
  let artists = album.artists.map(artist => artist.name).join(', ');
  let release_year = album.release_date.slice(0,4);
  let img_url = album.images[2].url;
  let album_html = `
	<li class='search-result-container'>
		<button class='search-result spotify-album-${album.id}' data-recs='${album.recs}'>
	    <img src='${img_url}' class='result-img'>
	    <p class='album-result-name'>${album_name}</p>
	    <p class='album-result-artists'>by ${artists}</p>
	    <p class='album-result-release_year'>released ${release_year}</p>
  	</button>
	</li>`;
  $('.search-results-container').append(album_html);
	$(`.search-result.spotify-album-${album.id}`).data(album);
  if (i < results.length - 1) $('.search-results-container').append('<div class="search-result-spacer"></div>');
}

function showArtistSearchResults(artist, i, results) {
  // console.log(artist);
  let img_url = artist.images[0].url;
  let artist_name = artist.name;
  let artist_html = `
	<li class='search-result-container'>
		<button class='search-result spotify-artist-${artist.id}' data-recs='${artist.recs}'>
    	<img src='${img_url}' class='result-img'>
    	<p class='artist-result-name'>${artist_name}</p>
  	</button>
	</li>`;
  $('.search-results-container').append(artist_html);
	$(`.search-result.spotify-artist-${artist.id}`).data(artist);
  if (i < results.length - 1) $('.search-results-container').append('<div class="search-result-spacer"></div>');
}
