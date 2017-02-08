var express = require('express'),
	app = express();

app.use(express.static(__dirname));

app.listen(3030,function(){
	console.log("server listening on port 3030");
});