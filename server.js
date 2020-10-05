const path = require("path");
const express = require('express');
const socketio = require('socket.io').listen(3000);
const parser = require('./js/parser.js');
const mqtt = require('mqtt');
require('dotenv').config();

const app = express();
const server = app.listen(4000, () => {
  console.log('server is running on port', server.address().port);
})

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'node_modules')));

socketio.on('connection', function (socket) {
  socket.emit('SOCKET CONNECTED');
});

const options = {
  host: process.env.MQTT_HOST,
  port: process.env.MQTT_PORT,
  protocol: process.env.MQTT_PROTOCOL,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
}

const client = mqtt.connect(options);

client.on("connect", () => {
  console.log("connected: " + client.connected)
});

client.on("error", (error) => {
  console.log("connection error" + error);
});

client.subscribe(process.env.MQTT_TOPIC);
client.on('message', (topic, message, packet) => {
  let result = parser.getMessageContent(topic, message);
  if (result.color) {
    socketio.emit('presence_sensor_on', result);
  }
  socketio.emit('message_on', result);
});
const http = require('http').Server(app);