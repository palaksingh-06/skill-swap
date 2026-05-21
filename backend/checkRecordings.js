require('dotenv').config();
const mongoose = require('mongoose');
const Session = require('./models/Session');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const sessions = await Session.find({ recordingUrl: { $ne: null } });
  console.log('Sessions with recordings:', sessions.length);
  sessions.forEach(s => console.log(s._id, s.recordingUrl));
  mongoose.disconnect();
});