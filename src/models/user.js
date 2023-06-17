const mongoose = require('mongoose')

const User = mongoose.model('User', {
  username: {
    type: String,
    unique: true,
    required: true
  },
  notes: [{
    type: mongoose.Types.ObjectId, ref: 'Note'
  }]
})

module.exports = User