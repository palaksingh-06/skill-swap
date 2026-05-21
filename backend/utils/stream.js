const { StreamChat } = require("stream-chat");
require("dotenv").config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("STREAM_API_KEY or STREAM_API_SECRET missing in .env");
}

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

function generateStreamToken(userId) {
  return serverClient.createToken(userId);
}

module.exports = { generateStreamToken };