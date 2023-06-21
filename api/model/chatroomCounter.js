const mongoose = require('mongoose');
const chatRoomCounterSchema = mongoose.Schema({
  counter: { type: Number },
});

module.exports = mongoose.model('ChatroomCounter', chatRoomCounterSchema);
