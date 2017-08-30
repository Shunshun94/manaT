const express = require('express');
const fs = require('fs');
const https = require('https');
const ManaTController = require('./js/ManaTController.js');

const app = express();;
const controller = new ManaTController();



app.get('/', controller.isExsits);

app.get('/getAll', controller.getAll);

app.get('/removeAll', controller.removeAll);

app.get('/addCharacter', controller.addCharacter);

app.get('/changeCharacter', controller.changeCharacter);

app.get('/updateCharacter', controller.updateCharacter);

app.get('/removeCharacter', controller.removeCharacter);

app.get('/getCharacter', controller.getCharacter);

app.get('/getCharacters', controller.getCharacters);



if(process.env.npm_package_config_key && process.env.npm_package_config_crt) {
	https.createServer({
		  key: fs.readFileSync(process.env.npm_package_config_key),
		  cert: fs.readFileSync(process.env.npm_package_config_crt),
		  passphrase: process.env.npm_package_config_passphrase
		}, app).listen(process.env.npm_package_config_port);
} else {
	app.listen(process.env.npm_package_config_port, function () {
		console.log('manaT listens on port ' + process.env.npm_package_config_port);
	});  
}
