"use strict";

var logger = require('winston'),
    path = require("path"),
    jwt = require("express-jwt"),
    unless = require('express-unless'),
    mongoose = require('mongoose'),
    express = require('express'),
    bodyParser = require("body-parser"),
    compression = require('compression'),
    response_time = require('response-time'),
    onFinished = require('on-finished');

var config = require("../config.json"),
    mongoose_uri = process.env.MONGOOSE_URI || "localhost/express-jwt-auth",
    utils = require(path.join(__dirname, "utils.js")),
    NotFoundError = require(path.join(__dirname, "errors", "not-found-error.js"));

mongoose.set('debug', true);
mongoose.connect(mongoose_uri);
mongoose.connection.on('error', function () {
    logger.info('Mongoose connection error');
});
mongoose.connection.once('open', function callback() {
    logger.info("Mongoose connected to the database");
});

var app = express();
app.use(require('morgan')("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(response_time());

app.use(function (req, res, next) {
    onFinished(res, function (err) {
        logger.debug("[%s] finished request", req.connection.remoteAddress);
    });
    next();
});

var jwtCheck = jwt({ secret: config.secret });
jwtCheck.unless = unless;

app.use(jwtCheck.unless({path: '/api/login' }));
app.use(utils.middleware().unless({path: '/api/login' }));

app.use("/api", require(path.join(__dirname, "routes", "default.js"))());

// all other requests redirect to 404
app.all("*", function (req, res, next) {
    next(new NotFoundError("404"));
});

// error handler for all the applications
app.use(function (err, req, res, next) {
    var errorType = typeof err,
        code = 500,
        msg = { message: "Internal Server Error" };

    switch (err.name) {
        case "UnauthorizedError":
            code = err.status;
            msg = undefined;
            break;
        case "BadRequestError":
        case "UnauthorizedAccessError":
        case "NotFoundError":
            code = err.status;
            msg = err.inner;
            break;
        default:
            break;
    }

    return res.status(code).json(msg);
});

module.exports = app;
