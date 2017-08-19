const crypto = require('crypto');
const ObjectDTO = require('./ObjectDTO.js');

const ObjectService = function() {
	this.objectDTO = new ObjectDTO();
};

ObjectService.prototype.generateTenantId = function(request) {
	var sha512 = crypto.createHash('sha512');
	sha512.update(request.query.tenant || request.params.tenant || request.ip);
	return sha512.digest('hex')
};

ObjectService.prototype.queryValidation = function(query, required) {
	required.forEach(function(word) {
		if(! Boolean(query[word])) {
			throw '引数「' + word + '」がありません。';
		}
	});
	return true;
};

ObjectService.prototype.boolealize = function(bool_candidate, opt_default) {
	if(bool_candidate === undefined) {
		if(opt_default === undefined) {
			return true;
		} else {
			return Boolean(opt_default);
		}
	}
	return Boolean(bool_candidate);
};

ObjectService.prototype.isNumber = function(num_candidate) {
	// http://aoking.hatenablog.jp/entry/20120217/1329452700
	if( typeof(num_candidate) !== 'number' && typeof(num_candidate) !== 'string' ) {
		return false;
	} else {
		return (num_candidate == parseFloat(num_candidate) && isFinite(num_candidate));
	}
};

ObjectService.prototype.numberlize = function(num_candidate, opt_default) {
	return this.isNumber(num_candidate) ? Number(num_candidate) : (opt_default || 0);
};

ObjectService.prototype.convertCounters = function(string) {
	var result = {};
	if(string === '') {
		return result;
	}
	string.split(',').forEach(function(v) {
		var kv = v.split(':');
		result[kv[0]] = kv[1];
	});
	return result;
};

ObjectService.prototype.getAll = function() {
	return this.objectDTO.getAll();
};

ObjectService.prototype.addCharacter = function(query, tenantId) {
	this.queryValidation(query, ['name', 'room']);
	try {
		var characterData = {
				type: 'characterData',
				targetName: query.name,
				name: query.name,
				size: Number(query.size) || 1,
				x: this.numberlize(query.x),
				y: this.numberlize(query.y),
				draggable: this.boolealize(query.draggable),
				isHide: this.boolealize(query.isHide, false),
				initiative: this.numberlize(query.initiative),
				dogTag: this.numberlize(query.dogTag, ''),
				url: query.url || '',
				info: query.info || '',
				imageName: query.image || '', // TODO デフォルト画像どうします？
				statusAlias: this.convertCounters(query.statusAlias || ''),
				counters: this.convertCounters(query.counters || '')
			};
	} catch (e) {
		console.error(e);
		console.trace();
		throw 'ManatInternalError:' + e.toString();
	}
	
	this.objectDTO.addCharacter(characterData, tenantId, query.room);
	return characterData;
};







module.exports = ObjectService;
