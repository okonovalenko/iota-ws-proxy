# iota-ws-proxy
IOTA IRI WebSocket server acts as a proxy between IRI service and front end applications. 
It supports all standard IRI Api commands and can be configured to automatically call those commands and push via WebSocket.


## Installation

### Prerequisites

#### Install Nodejs
`sudo apt-get update`
`curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -`
`sudo apt-get install nodejs`

#### Setup
`git clone https://github.com/okonovalenko/iota-ws-proxy.git`
`cd iota-ws-proxy`
`npm install`
`cp example.config.json config.json`

#### Configuration
Next you need to modify config.json with username and password which will be used on the client to authenticate with proxy.

nano config.json 


{
    "port": "5000", # port that will be used for incoming connections.
    "iriUrl": "http://localhost:14600", # IRI WebApi url.
    "username": "admin",
    "password": "iota_is_awesome",
    "authTimeout": 1000, # authentication timeout on WebSocket connection in ms. 
    "updateInterval": 3000, # interval in ms for IRI command updates.
    "updateCommands": "getNodeInfo,getNeighbors", # commands to query on updateInterval elapse.
    "updateIntervalOS": 3000 # interval in ms for OS updates.
}


#### Install PM2 node service manager.
PM2 is an excellent nodejs service manager it will run, monitor and restart your instance, if crashed.   

npm install pm2 -g

pm2 start server.js

pm2 list # to check that WebSocket server is running

pm2 monit # to monitor your instances

#### Make it run on restart

pm2 startup
pm2 save