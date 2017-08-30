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

module.exports = ManaTController;