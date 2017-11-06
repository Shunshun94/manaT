const express = require('express');
const fs = require('fs');
const https = require('https');
const ManaTController = require('./js/ManaTController.js');

const app = express();;
const controller = new ManaTController();



app.get('/', controller.isExsits);

app.get('/getAll', controller.getAll);

app.get('/removeAll', controller.removeAll);

app.get('/DodontoFServer.rb', controller.DodontoFServer.bind(controller));

app.get('/refresh', controller.refresh);

app.get('/addCharacter', controller.addCharacter.bind(controller));
app.get('/changeCharacter', controller.changeCharacter);
app.get('/updateCharacter', controller.updateCharacter);
app.get('/removeCharacter', controller.removeCharacter);
app.get('/getCharacter', controller.getCharacter);
app.get('/getCharacters', controller.getCharacters);

app.get('/addMemo', controller.addMemo.bind(controller));
app.get('/changeMemo', controller.changeMemo);
app.get('/removeMemo', controller.removeMemo);
app.get('/getMemos', controller.getMemos);

app.get('/addFloorTile', controller.addFloorTile.bind(controller));
app.get('/addDiceSymbol', controller.addDiceSymbol.bind(controller));
app.get('/addMapMask', controller.addMapMask.bind(controller));
app.get('/addMapMarker', controller.addMapMarker.bind(controller));
app.get('/addChit', controller.addChit.bind(controller));

app.get('/addObject', controller.addObject);
app.get('/changeObject', controller.changeObject);
app.get('/removeObject', controller.removeObject);
app.get('/getObjects', controller.getObjects);


app.get('/getMap', controller.getMap);
app.get('/setMap', controller.setMap);

function getDumps() {
	return new Promise(function(resolve, reject) {
		fs.readdir('./', function(listErr, fileList) {
			if(listErr) {
				console.error('Couldn not get dump file list.')
				reject(listErr);
				return;
			}
			
			var dumpFiles = fileList.filter(function(file) {
				return /dump_\d+/.test(file);
			}).map(function(file) {
				var temp = file.split('_');
				return {title: file, time: Number(temp[1])};
			}).sort(function(fileA, fileB) {
				return fileB.time - fileA.time;
			});
			
			if(dumpFiles.length === 0) {
				console.log('There no dump file.');
				resolve({data:{}});
				return;
			}
			fs.readFile('./' + dumpFiles[0].title, function(fileErr, dumpedData) {
				if(fileErr) {
					reject(fileErr);
					return;
				}
				try {
					var dumpedJson = JSON.parse(dumpedData);
					
					if(dumpedJson.result === 'OK') {
						console.log('Restore from', dumpFiles[0].title);
						resolve(dumpedJson);						
					} else {
						reject(dumpFiles[0].title + ' is invalid dump data.\nreason: ' + dumpedJson.result);
					}
				} catch (jsonParseError) {
					reject(jsonParseError)
				}
			});
		});
	});
}

function initialize(dumpData) {
	controller.restoreFromDump(dumpData);
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
}

getDumps().then(initialize).catch(function(failedReason) {
	console.log('FAIL', failedReason);
	throw failedReason.toString();
});
