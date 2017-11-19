const crypto = require('crypto');
const daoFactory = require('./dao/DaoFactory.js');
const PicsCatalog = require('../images/picsCatalog.js');

const ObjectService = function() {
	this.objectDAO = daoFactory.getObjectDao();
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

ObjectService.prototype.handleError = function(e, opt_errorMsg) {
	if(e.target) {
		throw opt_errorMsg ? 'Manat:' + opt_errorMsg : 'Manat:「' + e.target + '」が見つかりませんでした'
	} else {
		throw errorMsg;
	}
};

ObjectService.prototype.getAll = function() {
	return this.objectDAO.getAll();
};

ObjectService.prototype.removeAll = function(query) {
	return this.objectDAO.removeAll(query.characters || query.lastUpdateTime || query.lastUpdate || (new Date()).getTime());
};

ObjectService.prototype.restoreFromDump = function(dump) {
	this.objectDAO.restoreFromDump(dump);
};

ObjectService.prototype.getObjects = function(query, tenantId) {
	this.queryValidation(query, ['room']);
	var time = query.characters || query.lastUpdateTime || query.lastUpdate || 0;
	var filterFunction;
	
	if(query.type) {
		filterFunction = function(object) {
			return character.type === query.type;
		};
	}
	
	var password = query.password ? this.hash(query.password + tenantId) : '';
	return this.objectDAO.getObjects.apply(this.objectDAO, [time, tenantId, query.room, password, query.isVisitable, filterFunction]);
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

	var password = query.password ? this.hash(query.password + tenantId) : '';
	this.objectDAO.addCharacter.apply(this.objectDAO, [characterData, tenantId, query.room, password, query.isVisitable]);
	
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
	
	var password = query.password ? this.hash(query.password + tenantId) : '';
	return this.objectDAO.changeCharacter.apply(this.objectDAO, [characterData, tenantId, query.room, password, query.isVisitable]);
};

ObjectService.prototype.updateCharacter = function(query, tenantId) {
	this.queryValidation(query, ['room', 'targetName']);
	var characterData = {};
	
	var elements = ['targetName', 'name', 'info', 'image', 'url'];
	var numbers = ['x', 'y', 'size', 'initiative', 'rotation', 'dogTag'];
	var booleans = ['draggable', 'isHide']
	var counters = ['counters', 'statusAlias'];
	
	for(var key in query) {
		// includes is better but, version problem...
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

	var password = query.password ? this.hash(query.password + tenantId) : '';
	return this.objectDAO.updateCharacter.apply(this.objectDAO, [characterData, tenantId, query.room, password, query.isVisitable]);
};

ObjectService.prototype.removeCharacter = function(query, tenantId) {
	this.queryValidation(query, ['room', 'targetName']);
	var password = query.password ? this.hash(query.password + tenantId) : '';
	try {
		this.objectDAO.removeObject.apply(this.objectDAO, [query.targetName, tenantId, query.room, password, query.isVisitable]);
	} catch(e) {
		this.handleError(e, '「' + query.targetName + '」という名前のキャラクターは存在しません')
	}
	
};

ObjectService.prototype.getCharacter = function(query, tenantId) {
	this.queryValidation(query, ['room', 'targetName']);
	var password = query.password ? this.hash(query.password + tenantId) : '';
	return this.objectDAO.getCharacter.apply(this.objectDAO, [query.targetName, tenantId, query.room, password, query.isVisitable]);
};

ObjectService.prototype.getCharacters = function(query, tenantId) {
	this.queryValidation(query, ['room']);
	var time = query.characters || query.lastUpdateTime || query.lastUpdate || 0;
	
	var password = query.password ? this.hash(query.password + tenantId) : '';
	return this.objectDAO.getCharacters.apply(this.objectDAO, [time, tenantId, query.room, password, query.isVisitable]);
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
	
	var password = query.password ? this.hash(query.password + tenantId) : '';
	return this.objectDAO.addObject.apply(this.objectDAO, [memo, tenantId, query.room, password, query.isVisitable]);
};

ObjectService.prototype.changeMemo = function(query, tenantId) {
	this.queryValidation(query, ['room', ['targetId', 'targetName', 'imgId'], 'message']);
	
	var memo = {
		imgId: query.targetId || query.targetName || query.imgId,
		message: query.message
	};
	var password = query.password ? this.hash(query.password + tenantId) : '';
	return this.objectDAO.changeObject.apply(this.objectDAO, [memo, tenantId, query.room, password, query.isVisitable]);
};

ObjectService.prototype.addObject = function(query, tenantId) {
	this.queryValidation(query, ['room', 'type']);
	var data = {type: query.type};

	for(var key in query) {
		if(['room', 'tenant', 'callback', 'password', 'isVisitable'].indexOf(key) > -1) {
			// No action
		} else if(['targetId', 'targetName', 'imgId', 'name'].indexOf(key) > -1) {
			data.imgId = query[key];
		} else {
			data[key] = query[key];
		}
	}
	if(! Boolean(data.imgId)) {
		data.imgId = data.type + '_' + (new Date()).getTime()
	}
	var password = query.password ? this.hash(query.password + tenantId) : '';
	return this.objectDAO.addObject.apply(this.objectDAO, [data, tenantId, query.room, password, query.isVisitable]);
};

ObjectService.prototype.changeObject = function(query, tenantId) {
	this.queryValidation(query, ['room', ['targetId', 'targetName', 'imgId']]);
	var data = {};

	for(var key in query) {
		if(['room', 'tenant', 'callback', 'password', 'isVisitable'].indexOf(key) > -1) {
			// No action
		} else if(['targetId', 'targetName', 'imgId'].indexOf(key) > -1) {
			data.imgId = query[key];
		} else {
			data[key] = query[key];
		}
	}
	var password = query.password ? this.hash(query.password + tenantId) : '';
	return this.objectDAO.changeObject.apply(this.objectDAO, [data, tenantId, query.room, password, query.isVisitable]);
};

ObjectService.prototype.addFloorTile = function(query, tenantId) {
	var map = {
		room: query.room,
		type: 'floorTile',
		imgId: query.targetId || query.targetName || query.imgId || query.name || false,
		imageUrl: query.imageUrl || query.image || query.imageSource || PicsCatalog.getRandom('floorTile'),
		width:this.numberlize(query.width, 1),
		height:this.numberlize(query.height, 1),
		x:this.numberlize(query.x),
		y:this.numberlize(query.y)
	};
	
	return this.addObject(map, tenantId);
};

ObjectService.prototype.addDiceSymbol = function(query, tenantId) {
	var map = {
		room: query.room,
		type: 'diceSymbol',
		imgId: query.targetId || query.targetName || query.imgId || query.name || false,
		x:this.numberlize(query.x),
		y:this.numberlize(query.y),
		number:this.numberlize(query.number, 1),
		maxNumber:this.numberlize(query.maxNumber, 6),
		owner: query.owner || ''
	};
		
	return this.addObject(map, tenantId);
};

ObjectService.prototype.addMapMask = function(query, tenantId) {
	var map = {
		room: query.room,
		type: 'mapMask',
		imgId: query.targetId || query.targetName || query.imgId || query.name || false,
		color: query.color || 16711680,
		alpha: query.opacity || query.alpha || 0.5,
		width:this.numberlize(query.width, 1),
		height:this.numberlize(query.height, 1),
		x:this.numberlize(query.x),
		y:this.numberlize(query.y)
	};
	
	return this.addObject(map, tenantId);
};

ObjectService.prototype.addMapMarker = function(query, tenantId) {
	var map = {
		room: query.room,
		type: 'mapMarker',
		message: query.message || '-',
		imgId: query.targetId || query.targetName || query.imgId || query.name || false,
		color: query.color || false,
		isPaint: this.boolealize(query.isPaint, false),
		width:this.numberlize(query.width, 1),
		height:this.numberlize(query.height, 1),
		x:this.numberlize(query.x),
		y:this.numberlize(query.y)
	};
	
	return this.addObject(map, tenantId);
};

ObjectService.prototype.addChit = function(query, tenantId) {
	var map = {
		room: query.room,
		type: 'chit',
		info: query.info || query.message || '-',
		imgId: query.targetId || query.targetName || query.imgId || query.name || false,
		imageUrl: query.imageUrl || query.image || query.imageSource || PicsCatalog.getRandom('character'),
		width:this.numberlize(query.width, 1),
		height:this.numberlize(query.height, 1),
		x:this.numberlize(query.x),
		y:this.numberlize(query.y)
	};
	
	return this.addObject(map, tenantId);
};

ObjectService.prototype.removeObject = function(query, tenantId) {
	this.queryValidation(query, ['room', ['targetId', 'targetName', 'imgId']]);
	
	var imgId = query.targetId || query.targetName || query.imgId;
	var password = query.password ? this.hash(query.password + tenantId) : '';
	try {
		return this.objectDAO.removeObject.apply(this.objectDAO, [imgId, tenantId, query.room, password, query.isVisitable]);
	} catch (e) {
		this.handleError(e);
	}
};

ObjectService.prototype.getMemos = function(query, tenantId) {
	this.queryValidation(query, ['room']);
	var time = query.characters || query.lastUpdateTime || query.lastUpdate || 0;
	var password = query.password ? this.hash(query.password + tenantId) : '';
	return this.objectDAO.getMemos.apply(this.objectDAO, [time, tenantId, query.room, password, query.isVisitable]);
};

ObjectService.prototype.getMap = function(query, tenantId) {
	this.queryValidation(query, ['room']);
	var time = query.map || query.lastUpdateTime || query.lastUpdate || 0;
	var password = query.password ? this.hash(query.password + tenantId) : '';
	return this.objectDAO.getMap.apply(this.objectDAO, [time, tenantId, query.room, password, query.isVisitable]);
};

ObjectService.prototype.setMap = function(query, tenantId) {
	this.queryValidation(query, ['room']);
	var map = {};
	[{queryKey:'image', dataKey:'imageSource'}, {queryKey:'imageSource', dataKey:'imageSource'},
	 {queryKey:'width', dataKey:'xMax'}, {queryKey:'x', dataKey:'xMax'}, {queryKey:'xMax', dataKey:'xMax'},
	 {queryKey:'height', dataKey:'yMax'}, {queryKey:'y', dataKey:'yMax'}, {queryKey:'yMax', dataKey:'yMax'},
	 {queryKey:'size', dataKey:'xMax'}, {queryKey:'size', dataKey:'yMax'}].forEach(function(key) {
		if(query[key.queryKey]) {
			map[key.dataKey] = query[key.queryKey];
		}
	});
	
	var password = query.password ? this.hash(query.password + tenantId) : '';
	return this.objectDAO.setMap.apply(this.objectDAO, [map, tenantId, query.room, password, query.isVisitable]);
};

module.exports = ObjectService;
