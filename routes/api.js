let express = require('express');
let router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const Recommendation = require('../models/Recommendation.js');
const mongoose_random = require('mongoose-random');
const RecommendationEvent = require('../models/RecommendationEvent.js')
// console.log(mongoose.connection.readyState);

/*
███████ ███████  █████  ██████   ██████ ██   ██
██      ██      ██   ██ ██   ██ ██      ██   ██
███████ █████   ███████ ██████  ██      ███████
     ██ ██      ██   ██ ██   ██ ██      ██   ██
███████ ███████ ██   ██ ██   ██  ██████ ██   ██
*/

router.post('/search', function(req, res, next) {
  const spotify_base = 'https://api.spotify.com/v1/search/';
  let data = req.body.data;
  let params = `?q=${data.query}&type=${data.type}&limit=${data.limit}`;

  let spotify_token = req.app.locals.spotify_token;
  let headers = {
      Authorization: `Bearer ${spotify_token}`
  }

  axios.get(spotify_base+params, {
      headers: headers,
  }).then( spotify_res => {
      res.json(spotify_res.data) //Sends data to client
  }).catch( err => {
      console.log(err);
  }).finally( () => {
      console.log('Request complete!');
  })
});

/*
██████  ███████  ██████  ██████  ███    ███ ███    ███ ███████ ███    ██ ██████
██   ██ ██      ██      ██    ██ ████  ████ ████  ████ ██      ████   ██ ██   ██
██████  █████   ██      ██    ██ ██ ████ ██ ██ ████ ██ █████   ██ ██  ██ ██   ██
██   ██ ██      ██      ██    ██ ██  ██  ██ ██  ██  ██ ██      ██  ██ ██ ██   ██
██   ██ ███████  ██████  ██████  ██      ██ ██      ██ ███████ ██   ████ ██████
*/

router.post('/recommend', (req, res, next) => {
	let rec_data = req.body.data;
	//first, look to see if a rec exists in db (use spotify_id) before creating a new one
		//if rec exists, increment times_recommended by 1 and save the document.
		//if not, create a new rec and save it to the database.
		//always create a recommendationevent
	Recommendation.findOne({spotify_id: rec_data.id}, function(err, rec) {
		if (err) return console.error(err);

		if (rec != null) {
			rec.times_recommended += 1;
			rec.save(function(err) {
				if (err) return console.error(err);
			});
		} else {
			Recommendation.create({
				spotify_id: rec_data.id,
				obj_data: rec_data,
				times_recommended: 1
			}, function(err, rec_instance) {
				if (err) console.error(err);
				console.log(`Recommendation created for ${rec_instance.obj_name}`);
			}) //end of rec create()
		} //end of else

		RecommendationEvent.create({
			spotify_id: rec_data.id,
			obj_name: rec_data.name,
			obj_type: rec_data.type,
			date_recommended: new Date()
		}, function(err, rec_event_instance) {
				if(err) console.error(err);
				console.log(`Rec Event created for ${rec_event_instance.obj_name}`);
		})
	}) //end of findOne

})

/*
███████  ██████  ██████  ████████
██      ██    ██ ██   ██    ██
███████ ██    ██ ██████     ██
     ██ ██    ██ ██   ██    ██
███████  ██████  ██   ██    ██
*/

router.get('/sort', (req, res, next) => {
	console.log(req.query.type);
	console.log(req.query.date);

	let offset_ms = 0;
	if (req.query.date === 'day') offset_ms = 1000*60*60*24
	else if (req.query.date === 'week') offset_ms = 1000*60*60*24*7
	else if (req.query.date === 'month') offset_ms = 1000*60*60*24*30
	else if (req.query.date === 'year') offset_ms = 1000*60*60*24*365
	else if (req.query.date === 'all') offset_ms = new Date(1970, 0, 1).getTime()
	else console.log('Undefined time period!')

	RecommendationEvent
		.aggregate([
			{ $match: {
					"date_recommended": {	$gte: new Date(Date.now() - offset_ms)	},
					"obj_type": req.query.type
				}
			},
			{ $group: {
					"_id": { "spotify_id": "$spotify_id" },
					"count": { $sum: 1 }
				}
			},
			{ $sort: { "count": -1 } }
		])
		.limit(10)
		.exec(function(err, event_data) {
			if (err) return console.error(err)

			let spotify_ids = event_data.map(event => event._id.spotify_id)

			Recommendation
			.find({ 'spotify_id': { $in: spotify_ids} })
			.sort({'times_recommended': -1})
			.exec(function(err, recs) {
				console.log(event_data);
				res.json(recs)
			})
		})


})

router.get('/shuffle', (req, res, next) => {
	Recommendation.findRandom({obj_type: req.query.type}).limit(10).exec(function(err, recs) {
		if (err) console.error(err)
		res.json(recs)
	})
})

module.exports = router;
