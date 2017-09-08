# IOTA IRI WebSocket proxy

IOTA IRI WebSocket nodejs server acts as a proxy between IRI service and other applications. 
It supports all standard IRI API post commands, also can be configured to automatically call those commands and push via WebSocket to the client application.

Please also see [iota-ws-client](https://github.com/okonovalenko/iota-ws-client)

## Installation

### 1. Install Prerequisites

```
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install nodejs
```

### 2. Install IRI WebSocket server files
```
git clone https://github.com/okonovalenko/iota-ws-proxy.git
cd iota-ws-proxy
npm install
```

### 3. Configuration
Next, you need to modify config.json with username and password that will be used on the client to authenticate with the proxy.
```
cp example.config.json config.json
nano config.json 
```
```
{
    "port": "5000", # port that will be used for incoming ws connections.
    "iriUrl": "http://localhost:14600", # IRI Api access url.
    "username": "admin",
    "password": "iota_is_awesome",
    "authTimeout": 1000, # authentication timeout on WebSocket connection in ms. 
    "updateInterval": 3000, # interval in ms for IRI command updates.
    "updateCommands": "getNodeInfo,getNeighbors", # commands to query when updateInterval elapses.
    "updateIntervalOS": 3000 # interval in ms for OS updates to measure CPU load and memory usage on the server.
}
```

### 4. Install PM2 node service manager.
The PM2 is an excellent Nodejs service manager, it will run ./server.js as a service, monitor and restart in case of a crash.

```
npm install pm2 -g
pm2 start server.js # starts server.js as a service
pm2 list # to check that WebSocket server is running
pm2 monit # to monitor your instances
```

##### Make it run when computer restarts.
```
sudo pm2 startup
sudo pm2 save
```