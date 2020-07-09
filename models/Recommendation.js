const mongoose = require('mongoose');
const mongoose_random = require('mongoose-random');
// const autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(mongoose)
let RecommendationSchema = new mongoose.Schema({
	spotify_id: String, //not visible to clients
	obj_data: {},
	times_recommended: Number,
	dates_recommended: Array
});
RecommendationSchema.plugin(mongoose_random, {path: 'r'});
module.exports = mongoose.model('Recommendation', RecommendationSchema);
