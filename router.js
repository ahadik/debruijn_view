function route(handle, pathname, response, request, patharray) {
	console.log("Route request for: "+pathname);
	console.log("Route request for "+patharray[0]);
	if (typeof handle["/"+patharray[1]] === 'function') {
		handle["/"+patharray[1]](response, request, patharray);
	}else{
		console.log("No request handler found for " + pathname);
		response.writeHead(404, {"Content-Type": "text/html"})
		response.write("404 Not found");
		response.end();
	}
}

exports.route = route;