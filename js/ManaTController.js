const ObjectService = require('./ObjectService.js');
const service = new ObjectService();

function errorReturn(e, req) {
	var msg = e.toString();
	if(! msg.startsWith('Manat:')) {
		return {result: 'まなてぃでエラーが発生しました' + msg + '\n' +
			'よろしければ https://github.com/Shunshun94/manaT/issues にこのメッセージをコピペして起票するか @Shunshun94 に連絡してください。\n' +
			req.originalUrl};
	} else {
		return {result: msg.replace('Manat:', '')};
	}
};

function isAdminRequest(req) {
	if(req.ip.endsWith('127.0.0.1')) {
		return true;
	}
	throw 'Manat:管理者でないとこのコマンドは実行できません';
};

var ManaTController = function() {};



ManaTController.prototype.isExsits = function (req, res) {
	res.jsonp({result: 'OK', message:'まなてぃは起動しています'});
};

ManaTController.prototype.getAll = function (req, res) {
	try {
		isAdminRequest(req);
		res.jsonp({result: 'OK', data: service.getAll(req)});
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.removeAll = function (req, res) {
	try {
		isAdminRequest(req);
		service.removeAll(req.query)
		res.jsonp({result: 'OK'});
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.restoreFromDump = function(dump) {
	service.restoreFromDump(dump);
};

ManaTController.prototype.DodontoFServer = function (req, res) {
	try {
		var unsupportedCommands = ["notSupportedCommand",
		                           "getBusyInfo","getServerInfo","getRoomList",
		                           "getLoginInfo","getLoginUserInfo","chat","talk",
		                           "getChatColor","getRoomInfo","setRoomInfo",
		                           "addMessageCard","uploadImageData"];
		var supportedCommands = {
				'addCharacter': 'addCharacter',
				'changeCharacter': 'changeCharacter',
				"addMemo": "addMemo",
				"changeMemo": "changeMemo",
				'refresh': 'refresh'};//'getCharacters'};
		var command = req.query.webif;
		if(command) {
			if(unsupportedCommands.indexOf(command) > -1) {
				res.jsonp({result: 'command [' + command + '] is NOT supported'});
			} else if(supportedCommands[command]) {
				var self = this;
				this[supportedCommands[command]].apply(this, [req, res]);
			} else {
				res.jsonp({result: 'command [' + command + '] is NOT found'});
			}
		} else {
			res.jsonp(['まなてぃは起動しています']);
		}
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.changeCharacter = function (req, res) {
	try {
		var character = service.changeCharacter(req.query, service.generateTenantId(req));
		res.jsonp({result: 'OK', data: character});
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.updateCharacter = function (req, res) {
	try {
		var character = service.updateCharacter(req.query, service.generateTenantId(req));
		res.jsonp({result: 'OK', data: character});
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.removeCharacter = function (req, res) {
	try {
		service.removeCharacter(req.query, service.generateTenantId(req));
		res.jsonp({result: 'OK'});
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.getCharacter = function (req, res) {
	try {
		var character = service.getCharacter(req.query, service.generateTenantId(req));
		res.jsonp({result: 'OK', data: character});
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.getCharacters = function (req, res) {
	try {
		var characters = service.getCharacters(req.query, service.generateTenantId(req));
		characters.result = 'OK';
		res.jsonp(characters);
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};



ManaTController.prototype.changeMemo = function (req, res) {
	try {
		var memo = service.changeMemo(req.query, service.generateTenantId(req));
		res.jsonp({result: 'OK', data: memo});
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.removeMemo = function (req, res) {
	try {
		service.removeObject(req.query, service.generateTenantId(req));
		res.jsonp({result: 'OK'});
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.getMemos = function (req, res) {
	try {
		var memos = service.getMemos(req.query, service.generateTenantId(req));
		res.jsonp({result: 'OK', memos: memos});
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.addObject_ = function (req, res, opt_method, opt_key) {
	try {
		var method = opt_method || 'addObject';
		var object = service[method].apply(service, [req.query, service.generateTenantId(req)]);
		var resultData = {result: 'OK'};
		resultData[opt_key || 'data'] = object;
		res.jsonp(resultData);
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.addObject = function (req, res) {this.addObject_(req, res);};
ManaTController.prototype.addCharacter = function (req, res) {this.addObject_(req, res, 'addCharacter');};
ManaTController.prototype.addMemo = function (req, res) {this.addObject_(req, res, 'addMemo');};
ManaTController.prototype.addFloorTile  = function (req, res) {this.addObject_(req, res, 'addFloorTile');};
ManaTController.prototype.addMapMask  = function (req, res) {this.addObject_(req, res, 'addMapMask');};
ManaTController.prototype.addMapMarker  = function (req, res) {this.addObject_(req, res, 'addMapMarker');};
ManaTController.prototype.addChit  = function (req, res) {this.addObject_(req, res, 'addChit');};
ManaTController.prototype.addDiceSymbol  = function (req, res) {this.addObject_(req, res, 'addDiceSymbol');};
ManaTController.prototype.addCard  = function (req, res) {this.addObject_(req, res, 'addCard');};

ManaTController.prototype.changeObject = function (req, res) {
	try {
		res.jsonp({result: 'OK', data: service.changeObject(req.query, service.generateTenantId(req))});
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.removeObject = function (req, res) {
	try {
		service.removeObject(req.query, service.generateTenantId(req));
		res.jsonp({result: 'OK'});
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.getObjects = function (req, res) {
	try {
		var characters = service.getObjects(req.query, service.generateTenantId(req));
		characters.result = 'OK';
		res.jsonp(characters);
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.getMap = function (req, res) {
	try {
		res.jsonp(service.getMap(req.query, service.generateTenantId(req)));
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.setMap = function (req, res) {
	try {
		var map = service.setMap(req.query, service.generateTenantId(req));
		res.jsonp({result: 'OK', mapData: map});
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

ManaTController.prototype.refresh = function(req, res) {
	const targetList = {
			characters: {method: 'getObjects', lastUpdate: 'characters', key: 'characters'},
			map: {method: 'getMap', lastUpdate: 'map', key: 'mapData'},
			// time: {method: 'getTime', lastUpdate: 'time'},
			// effects:  {method: 'getEffects', lastUpdate: 'effects'},
			// roomInfo:  {method: 'getRoomInfo', lastUpdate: 'playRoomInfo'},
			// chat: {method: 'getChatDummy', lastUpdate:'chatMesageDatalog'},
			// 
	};
	
	var values = {
		lastUpdateTimes: {},
		graveyard:[], // TODO implement
		result: 'OK'
	};
	var tenantId = service.generateTenantId(req);
	var query = req.query;
	
	for(var key in targetList) {
		if(query[key]) {
			var tempResult = service[targetList[key].method](query, tenantId);
			values[targetList[key].key] = tempResult[targetList[key].key];
			values.lastUpdateTimes[targetList[key].lastUpdate] = tempResult.lastUpdateTimes[targetList[key].lastUpdate];
		}
	}
	res.jsonp(values);
};

module.exports = ManaTController;