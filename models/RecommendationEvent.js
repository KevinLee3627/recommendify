const mongoose = require('mongoose');

let RecommendationEventSchema = new mongoose.Schema({
	spotify_id: String,
	obj_name: String,
	date_recommended: Date
});

module.exports = mongoose.model('RecommendationEvent', RecommendationEventSchema)
