var http = require("http");
var url = require("url");
var fs = require('fs');

var exec = require("child_process").exec;

function start(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log(pathname+" was parsed from the URL");
		var patharray = pathname.split("/");
		if (pathname !== "/favicon.ico"){
			if(pathname === "/style.css"){
				response.writeHead(200, {'Content-Type': 'text/css'});
				response.write(fs.readFileSync("style.css", 'utf8'));	
				response.end();
			}else{
				route(handle, pathname, response, request, patharray);				
			}
		}
	}

	http.createServer(onRequest).listen(process.env.PORT || 5000);
	console.log("Server has started.");
}

exports.start = start;