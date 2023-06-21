const mongoose = require('mongoose');
const chatRoomSchema = mongoose.Schema({
  chatroom: { type: Number },
  creater: { type: String },
  member: { type: String },
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
