// name files after the model name
const mongoose = require('mongoose');

const faveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  herb: {
    type: mongoose.Types.ObjectId,
    ref: 'Herb',
    required: true
  }
});

// use full TitleCased names for model names
module.exports = mongoose.model('Favorite', faveSchema);
