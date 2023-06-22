require('dotenv').config();
require('./config/database').connect();
const mongoose = require('mongoose')

const express = require('express');
const Users = require('./model/users');
const Messages = require('./model/messages');
const ChatRoom = require('./model/chatRoom');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const Pusher = require('pusher')

const pusher = new Pusher({
  appId: "1622048",
  key: "70275e031e7ebbf7f513",
  secret: "ef47589b76b823b02e0e",
  cluster: "ap1",
  useTLS: true
});

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// DB config
const db = mongoose.connection

db.once('open', () => {
  console.log("DB connected");

  const msgCollection = db.collection('messagecontents');
  const changeStream = msgCollection.watch();

  changeStream.on('change', (change) => {
    // console.log("Changed", change)

    if (change.operationType === 'insert') {
      const messageDetails = change.fullDocument;
      pusher.trigger('messages', 'inserted',
        {
          name: messageDetails.sender,
          message: messageDetails.message,
          timestamp: messageDetails.timestamp,
          received: messageDetails.received,
        }
      )
    } else {
      console.log('Error triggering Pusher');
    }
  })
})

// Register
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
      res.status(400).send("All input is required");
    }

    const oldUser = await Users.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User already exist. Please login");
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword
    })
    
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h"},
    );

    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);

  } catch (error) {
    console.log(error)
  }
})

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid email");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).send("Invalid password");
    }

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    user.token = token;

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

// Logout
app.post('/logout', (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Chat
app.post('/messages/new', async (req, res) => {
  try {
    const createdMessage = await Messages.create(req.body);
    res.status(201).send(createdMessage);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Sync
app.get('/messages/sync', async (req, res) => {
  try {
    const data = await Messages.find();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get users
app.get('/users', async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Chat room
app.get('/chatrooms', async (req, res) => {
  try {
    const chatrooms = await ChatRoom.find();
    res.status(200).json(chatrooms);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/chatrooms', async (req, res) => {
  try {
    const { creater, member } = req.body;

    const chatroomNumber = new Date().getTime();
    const chatroom = new ChatRoom({
      chatroom: chatroomNumber,
      creater: creater,
      member: member,
    });
    
    await chatroom.save();
    res.status(201).send(chatroom);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send(error);
  }
});


// Test
app.get('/', (auth, (req, res) => {
  res.status(200).send('Welcome 🙏');
}));

module.exports = app