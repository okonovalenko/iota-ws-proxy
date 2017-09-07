const express = require('express');
const config = require('./config');
const app = express();
const server = require('http').Server(app);
const initSocketServer = require('./socket')(server);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

const port = process.env.PORT || config.port;
server.listen(port, () => {
    console.log('IOTA Websocket proxy server is listening on port ' + port);
});