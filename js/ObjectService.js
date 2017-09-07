const crypto = require('crypto');
const ObjectDAO = require('./ObjectDAO.js');

const ObjectService = function() {
	this.objectDAO = new ObjectDAO();
};

ObjectService.prototype.hash = function(seed) {
	var sha512 = crypto.createHash('sha512');
	sha512.update(seed);
	return sha512.digest('hex')
};

ObjectService.prototype.generateTenantId = function(request) {
	return this.hash((request.query.tenant || request.params.tenant || request.ip));
};

ObjectService.prototype.queryValidation = function(query, required) {
	required.forEach(function(word) {
		if(Array.isArray(word)) {
			if(word.filter(function(part){
				return query[part];
			}).length === 0) {
				throw 'Manat:引数「' + word.join('」「') + '」のいずれもありません。';
			}
		} else {
			if(! Boolean(query[word])) {
				throw 'Manat:引数「' + word + '」がありません。';
			}
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
	return this.objectDAO.getAll();
};

ObjectService.prototype.removeAll = function(query) {
	return this.objectDAO.removeAll(query.characters || query.lastUpdateTime || query.lastUpdate || (new Date()).getTime());
};

ObjectService.prototype.addCharacter = function(query, tenantId) {
	this.queryValidation(query, ['room', 'name']);
	var characterData = {
			type: 'characterData',
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
			imageName: query.image || 'https://shunshun94.github.io/manaT/images/default.png',
			statusAlias: this.convertCounters(query.statusAlias || ''),
			counters: this.convertCounters(query.counters || '')
		};

	if(query.password) {
		var password = this.hash(query.password + tenantId);
		if(query.isVisitable) {
			this.objectDAO.addCharacter(characterData, tenantId, query.room, password, query.isVisitable);
		} else {
			this.objectDAO.addCharacter(characterData, tenantId, query.room, password);
		}
	} else {
		this.objectDAO.addCharacter(characterData, tenantId, query.room);
	}
	
	return characterData;
};

ObjectService.prototype.changeCharacter = function(query, tenantId) {
	this.queryValidation(query, ['room', 'targetName']);
	var characterData = {};
	
	var elements = ['targetName', 'name', 'info', 'image', 'url'];
	var numbers = ['x', 'y', 'size', 'initiative', 'rotation', 'dogTag'];
	var booleans = ['draggable', 'isHide']
	var counters = ['counters', 'statusAlias'];
	
	for(var key in query) {
		if(elements.indexOf(key) > -1) {
			if(key === 'image') {
				characterData.imageName = query[key];
			} else {
				characterData[key] = query[key];
			}
		}else if(numbers.indexOf(key) > -1) {
			characterData[key] = this.numberlize(query[key]);
		}else if(booleans.indexOf(key) > -1) {
			characterData[key] = this.boolealize(query[key]);
		}else if(counters.indexOf(key) > -1) {
			characterData[key] = this.convertCounters(query[key]);
		}
	}
	
	var result;

	if(query.password) {
		var password = this.hash(query.password + tenantId);
		if(query.isVisitable) {
			result = this.objectDAO.changeCharacter(characterData, tenantId, query.room, password, query.isVisitable);
		} else {
			result = this.objectDAO.changeCharacter(characterData, tenantId, query.room, password);
		}
	} else {
		result = this.objectDAO.changeCharacter(characterData, tenantId, query.room);
	}
	
	return result;
};

ObjectService.prototype.updateCharacter = function(query, tenantId) {
	this.queryValidation(query, ['room', 'targetName']);
	var characterData = {};
	
	var elements = ['targetName', 'name', 'info', 'image', 'url'];
	var numbers = ['x', 'y', 'size', 'initiative', 'rotation', 'dogTag'];
	var booleans = ['draggable', 'isHide']
	var counters = ['counters', 'statusAlias'];
	
	for(var key in query) {
		if(elements.indexOf(key) > -1) {
			if(key === 'image') {
				characterData.imageName = query[key];
			} else {
				characterData[key] = query[key];
			}
		}else if(numbers.indexOf(key) > -1) {
			characterData[key] = this.numberlize(query[key]);
		}else if(booleans.indexOf(key) > -1) {
			characterData[key] = this.boolealize(query[key]);
		}else if(counters.indexOf(key) > -1) {
			characterData[key] = this.convertCounters(query[key]);
		}
	}
	
	var result;

	if(query.password) {
		var password = this.hash(query.password + tenantId);
		if(query.isVisitable) {
			result = this.objectDAO.updateCharacter(characterData, tenantId, query.room, password, query.isVisitable);
		} else {
			result = this.objectDAO.updateCharacter(characterData, tenantId, query.room, password);
		}
	} else {
		result = this.objectDAO.updateCharacter(characterData, tenantId, query.room);
	}
	
	return result;
};

ObjectService.prototype.removeCharacter = function(query, tenantId) {
	this.queryValidation(query, ['room', 'targetName']);
	if(query.password) {
		var password = this.hash(query.password + tenantId);
		if(query.isVisitable) {
			this.objectDAO.removeCharacter(query.targetName, tenantId, query.room, password, query.isVisitable);
		} else {
			this.objectDAO.removeCharacter(query.targetName, tenantId, query.room, password);
		}
	} else {
		this.objectDAO.removeCharacter(query.targetName, tenantId, query.room);
	}
};

ObjectService.prototype.getCharacter = function(query, tenantId) {
	this.queryValidation(query, ['room', 'targetName']);
	if(query.password) {
		var password = this.hash(query.password + tenantId);
		if(query.isVisitable) {
			return this.objectDAO.getCharacter(query.targetName, tenantId, query.room, password, query.isVisitable);
		} else {
			return this.objectDAO.getCharacter(query.targetName, tenantId, query.room, password);
		}
	} else {
		return this.objectDAO.getCharacter(query.targetName, tenantId, query.room);
	}
};

ObjectService.prototype.getCharacters = function(query, tenantId) {
	this.queryValidation(query, ['room']);
	var time = query.characters || query.lastUpdateTime || query.lastUpdate || 0;
	if(query.password) {
		var password = this.hash(query.password + tenantId);
		if(query.isVisitable) {
			return this.objectDAO.getCharacters(time, tenantId, query.room, password, query.isVisitable);
		} else {
			return this.objectDAO.getCharacters(time, tenantId, query.room, password);
		}
	} else {
		return this.objectDAO.getCharacters(time, tenantId, query.room);
	}
};

ObjectService.prototype.addMemo = function(query, tenantId) {
	this.queryValidation(query, ['room', 'message']);
	
	var memo = {
		type: 'memo',
		imgId: query.name || query.imgId || 'memo_' + (new Date()).getTime(),
		message: query.message,
		rotation:this.numberlize(query.rotation),
		draggable:this.boolealize(query.draggable, true),
		y:this.numberlize(query.y),
		x:this.numberlize(query.x),
		width:this.numberlize(query.x, 1)
	};
	
	if(query.password) {
		var password = this.hash(query.password + tenantId);
		if(query.isVisitable) {
			return this.objectDAO.addMemo(memo, tenantId, query.room, password, query.isVisitable);
		} else {
			return this.objectDAO.addMemo(memo, tenantId, query.room, password);
		}
	} else {
		return this.objectDAO.addMemo(memo, tenantId, query.room);
	}
};

ObjectService.prototype.changeMemo = function(query, tenantId) {
	this.queryValidation(query, ['room', ['targetId', 'targetName', 'imgId'], 'message']);
	
	var memo = {
		imgId: query.targetId || query.targetName || query.imgId,
		message: query.message
	};
	
	if(query.password) {
		var password = this.hash(query.password + tenantId);
		if(query.isVisitable) {
			return this.objectDAO.changeMemo(memo, tenantId, query.room, password, query.isVisitable);
		} else {
			return this.objectDAO.changeMemo(memo, tenantId, query.room, password);
		}
	} else {
		return this.objectDAO.changeMemo(memo, tenantId, query.room);
	}
};


ObjectService.prototype.removeMemo = function(query, tenantId) {
	this.queryValidation(query, ['room', ['targetId', 'targetName', 'imgId']]);
	
	var imgId = query.targetId || query.targetName || query.imgId;
	
	if(query.password) {
		var password = this.hash(query.password + tenantId);
		if(query.isVisitable) {
			return this.objectDAO.removeMemo(imgId, tenantId, query.room, password, query.isVisitable);
		} else {
			return this.objectDAO.removeMemo(imgId, tenantId, query.room, password);
		}
	} else {
		return this.objectDAO.removeMemo(imgId, tenantId, query.room);
	}
};

ObjectService.prototype.getMemos = function(query, tenantId) {
	this.queryValidation(query, ['room']);
	var time = query.characters || query.lastUpdateTime || query.lastUpdate || 0;
	if(query.password) {
		var password = this.hash(query.password + tenantId);
		if(query.isVisitable) {
			return this.objectDAO.getMemos(time, tenantId, query.room, password, query.isVisitable);
		} else {
			return this.objectDAO.getMemos(time, tenantId, query.room, password);
		}
	} else {
		return this.objectDAO.getMemos(time, tenantId, query.room);
	}
};


module.exports = ObjectService;
