const mongoose = require('mongoose');
const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  votes: {
    type: Number,
  },
});
module.exports = mongoose.model('Game', gameSchema);
