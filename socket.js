const axios = require('axios');
const socketio_auth = require('socketio-auth');
const socketio = require('socket.io');
const config = require('./config');
const os = require('os-utils');

const REQ_COMMAND = 'req';
const RES_COMMAND = 'res';

const ON_TIMER_COMMAND = 'onCommand';
const ON_OS_UPDATE = 'onOsUpdate';

const handleError = (error, socket, reqId) => {
    var error_resp = {};
    if (error.response) {
        console.log('Response error:', error.response.status, error.response.data);
        error_resp = { error: error.response.data, reqId: reqId };
    } else if (error.request) {
        console.log('The request was made but no response was received');
        error_resp = { error: 'The request was made but no response was received', reqId: reqId };
    } else {
        console.log('Internal error', error.message);
        error_resp = { error: 'Internal error', reqId: reqId };
    }

    if (socket)
        socket.emit(RES_COMMAND, error_resp);
};

const authenticate = (socket, data, callback) => {
    var username = data.username;
    var password = data.password;

    if (config.username == username && config.password == password) {
        return callback(null, true);
    } else {
        return callback(new Error("Unauthorized"));
    }
};

const disconnect = (socket) => {
    console.log('socket disconnected', socket.id);
};

const postAuthenticate = (socket) => {

    socket.on(REQ_COMMAND, (data) => {

        if (!data) return;
        var reqId = data.reqId;
        axios.post(config.iriUrl, data)
            .then((res) => {
                if (res)
                    socket.emit(RES_COMMAND, { reqId: reqId, data: res.data });
            })
            .catch((error) => {
                handleError(error, socket, reqId);
            });
    });
};

const initCommandTimer = (io) => {
    if (!config.updateCommands || config.updateInterval == 0) return;

    var arrayOfCommands = config.updateCommands.split(',');

    setInterval(() => {
        arrayOfCommands.map((command) => {
            command = command.trim();
            axios.post(config.iriUrl, { command })
                .then((res) => {
                    if (res)
                        io.emit(ON_TIMER_COMMAND, { data: res.data, command });
                })
                .catch((error) => {
                    handleError(error);
                });
        });

    }, config.updateInterval);

};

const initOsTimer = (io) => {
    if (config.updateIntervalOS == 0) return;

    setInterval(() => {
        os.cpuUsage((cpu) => {
            var data = {
                cpuUsage: cpu,
                cpuCount: os.cpuCount(),
                platform: os.platform(),
                freemem: os.freemem(),
                totalmem: os.totalmem(),
                freememPercentage: os.freememPercentage(),
                sysUptime: os.sysUptime(),
                processUptime: os.processUptime(),
                load: [os.loadavg(1), os.loadavg(5), os.loadavg(15)],
                timestamp: Date.now()
            };

            io.emit(ON_OS_UPDATE, { data });
        });
    }, config.updateIntervalOS);
};

const initSocketServer = (server) => {
    var io = socketio(server);

    socketio_auth(io, {
        authenticate: authenticate,
        postAuthenticate: postAuthenticate,
        disconnect: disconnect,
        timeout: config.authTimeout
    });

    initCommandTimer(io);

    initOsTimer(io);

    return io;
};

module.exports = initSocketServer;

