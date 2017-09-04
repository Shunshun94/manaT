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

// ManaTController.prototype.

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

ManaTController.prototype.DodontoFServer = function (req, res) {
	try {
		var unsupportedCommands = ["notSupportedCommand",
		                           "getBusyInfo","getServerInfo","getRoomList",
		                           "getLoginInfo","getLoginUserInfo","chat","talk",
		                           "getChatColor","getRoomInfo","setRoomInfo",
		                           "addMemo","changeMemo","addMessageCard","uploadImageData"];
		var supportedCommands = {
				'addCharacter': 'addCharacter',
				'changeCharacter': 'changeCharacter',
				'refresh': 'getCharacters'};
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

ManaTController.prototype.addCharacter = function (req, res) {
	try {
		var character = service.addCharacter(req.query, service.generateTenantId(req));
		res.jsonp({result: 'OK', data: character});
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

ManaTController.prototype.addMemo = function (req, res) {
	try {
		var memo = service.addMemo(req.query, service.generateTenantId(req));
		res.jsonp({result: 'OK', data: memo});
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

ManaTController.prototype.getMemos = function (req, res) {
	try {
		var memos = service.getMemos(req.query, service.generateTenantId(req));
		res.jsonp({result: 'OK', memos: memos});
	} catch (e) {
		res.jsonp(errorReturn(e, req));
	}
};

module.exports = ManaTController;