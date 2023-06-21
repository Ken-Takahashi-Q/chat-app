const mongoose = require('mongoose');
const messageSchema = mongoose.Schema({
  chatroomId: { type: Number },
  sender: { type: String },
  message: { type: String },
  timestamp: { type: String },
  received: { type: Boolean },
});

module.exports = mongoose.model('messagecontents', messageSchema);
