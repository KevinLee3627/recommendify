let express = require('express');
let router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const Recommendation = require('../models/Recommendation.js');
const mongoose_random = require('mongoose-random');
const RecommendationEvent = require('../models/RecommendationEvent.js')
// console.log(mongoose.connection.readyState);

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


router.post('/recommend', (req, res, next) => {
	// console.log(req.body);
	let rec_data = req.body.data;
	//first, look to see if a rec exists in db (use spotify_id) before creating a new one
		//if rec exists, increment times_recommended by 1 and save the document.
		//if not, create a new rec and save it to the database.
	Recommendation.findOne({spotify_id: rec_data.id}, function(err, rec) {
		if (err) return console.error(err);
		//IF Recommendation HAS BEEN CREATED FOR SPOTIFY OBJECT, INCREMENT times_recommended BY 1
		//OTHERWISE, CREATE NEW Recommendation DOCUMENT
		//FINALLY, ALWAYS CREATE A NEW RecommendationEvent
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
			date_recommended: new Date()
		}, function(err, rec_event_instance) {
				if(err) console.error(err);
				console.log(`Rec Event created for ${rec_event_instance.obj_name}`);
		})
	}) //end of findOne

})

router.get('/sort', (req, res, next) => {
	console.log(req.query.type);
	console.log(req.query.date);

//How to sort recs with most recs by type/date?
//1. Sort rec events by spotify id with most recs in last (x) days
//2. Find object with the spotify id
//or... restructure the Rec model and delete the RecEvent model entirely
//1. add dates_recommended to Rec model, should be array with dates
//2. if going this route, figure out how to transfer dates from recevents
//   to the rec documents w/ corresponding spotify ids
//USE GITHUB BEFORE TAKING THIS STEP!!!
	RecommendationEvent.count({
		
	})

	// Recommendation.findRandom().limit(10).exec(function(err, recs) {
	// 	if (err) console.error(err)
	//
	// 	res.json(recs)
	// })
})

module.exports = router;
