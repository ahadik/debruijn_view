var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable"),
	util = require('util');


function start(response, postData) {
	console.log("Request handler 'start' was called");
	
	fs.readFile('home.html', function(err, home_page){
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(home_page);
		response.end();
	});
}

function fillKmers(text,k){
	var kmers = new Array();
	for (var i=0; i<=text.length-k; i++){
		kmers.push(text.substr(i, k))
	}
	
	return kmers;
}

function makeNeighborArrays(string, kmerArray){
	var neighborArray = new Array();
	var substring = string.substr(1);
	for(kmer in kmerArray){
		var kmerSub = kmerArray[kmer].substring(0, string.length-1);
		if(substring===kmerSub){
			neighborArray.push(kmerArray[kmer]);
		}
	}
	return neighborArray;
}

function graph(response, request){
	console.log("Request handler 'graph' was called");
	
	var form = new formidable.IncomingForm();
	
	
	form.parse(request, function(error, fields, files){
		//Define the filepath from the user's submission
		var text = fields.sourceText;
		text = text.replace(/(\r\n|\n|\r)/gm,'');
		var k = parseInt(fields.kvalue);
		var kmers = fillKmers(text,k);
		
		var kmerHash = {};
		
		for(kmer in kmers){
			kmerHash[kmers[kmer]]=makeNeighborArrays(kmers[kmer], kmers);
		}

		var graphJSON = '{"kmers":[\n';
							
		for (kmer in kmerHash){
			for (neighbor in kmerHash[kmer]){
				graphJSON=graphJSON+'{"source": "'+kmer+'", "target": "'+kmerHash[kmer][neighbor]+'"},\n';
			}			
		}
		graphJSON=graphJSON.slice(0,-2)+'\n]}';
		
		fs.readFile('graph_header.html', function (err, graph_header) {
	    	if (err) {
	        	throw err; 
			} 
			fs.readFile('graph_body.html', function(err, graph_body){
				if (err){
					throw err;
				}
			
				var JSON = 'var graph_data=\n'+graphJSON+';\n';
				
				var graph_response = graph_header+JSON+graph_body;
			
				response.writeHead(200, {"Content-Type": "text/html"});
				response.write(graph_response);
				response.end();
			});
		});
	});
	}
exports.start = start;
exports.display = graph;