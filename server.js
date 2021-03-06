var http = require("http");
var https = require("https");
var url = require("url");
var fs = require("fs");
var process = require("process");

// allow only these requests
var ALLOWED = ["/style.css", "/kset-logo.png", "/scripts/main.js",
               "/scripts/fetching.js", "/scripts/globals.js",
               "/scripts/structures.js", "/scripts/translation.js"];

var fullURL = "https://www.kset.org";

var options = {
    host : "www.kset.org",
    path : "/feeds/rss/"
};

// index page
function land(response) {
    response.writeHead(200, { "Content-Type" : "text/html",
                              "Access-Control-Allow-Origin" : '*' });
    fs.createReadStream("index.html").pipe(response);
}

// fetch data from the server
function fetch(response, link) {
    options.path = link;

    console.log(link);

    https.get(options, function(res) {
        res.on("data", function(chunk) {
            response.write(chunk.toString());
        });

        res.on("end", function() {
            response.end();
        });
    });
}

// send a request to KSET.org
function askFor(reqData, response) {
    response.writeHead(200, { "Content-Type" : "text/xml",
                              "Access-Control-Allow-Origin" : '*' });
    if("site" in reqData.query) {
        var link = reqData.query["site"];
        
        if(link.lastIndexOf(fullURL, 0) === 0) {
            fetch(response, link.slice(fullURL.length));
        } else {
            response.write("Illegal request!");
            response.end();
        }
    } else {
        response.write("Invalid token.");
        response.end();
    }
}

// callback after a failure
function report(response) {
    response.writeHead(404, { "Content-Type" : "text/plain" });
    response.write("Error 404: page content not found");
    response.end();
}

// choose what to serve, according to the request
function route(reqData, response) {
    if (reqData.pathname === "/") {
        console.log("Request for landing page");
        land(response);
    } else if (reqData.pathname === "/fetch") {
        console.log("Request for fetching HTML from a remote server");
        askFor(reqData, response);
    } else if (ALLOWED.indexOf(reqData.pathname) !== -1) {
        console.log("A valid request for: " + reqData.pathname);
        response.writeHead(200);
        fs.createReadStream("." + reqData.pathname).pipe(response);
    } else {
        console.log("Invalid request for: " + reqData.pathname);
        report(response);
    }
}

var server = http.createServer(function(request, response) {
    route(url.parse(request.url, true), response);
});

server.listen(8080);
