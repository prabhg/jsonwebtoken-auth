"use strict";

var logger = require('./logger');
var server = require('./server/app.js');
var fs = require("fs");
var path = require("path");
var http = require('http');
var https = require('https');
var http_port = process.env.HTTP_PORT || 3000;
var https_port = process.env.HTTPS_PORT || 3443;

http.createServer(server).listen(http_port, function () {
    logger.info("HTTP Server listening on port: %s, in %s mode", http_port, server.get('env'));
});

var httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, "server/keys", "server.key")),
    cert: fs.readFileSync(path.join(__dirname, "server/keys", "server.crt")),
    requestCert: true,
    rejectUnauthorized: false
};
https.createServer(httpsOptions, server).listen(https_port, function () {
    logger.info("HTTPS Server listening on port: %s, in %s mode", https_port, server.get('env'));
});
