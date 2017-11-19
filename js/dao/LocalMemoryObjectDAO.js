const LocalMemoryObjectDAO = function() {
	this.store = {};
};

LocalMemoryObjectDAO.prototype.getTenant = function(tenantId) {
	if(! Boolean(this.store[tenantId])) {
		this.store[tenantId] = {};
		this.store[tenantId].rooms = {};
	}
	this.store[tenantId].lastAccess = (new Date()).getTime();
	return this.store[tenantId];
};

LocalMemoryObjectDAO.prototype.getRoom = function(tenantId, roomId, opt_password, opt_visitable) {
	var tenant = this.getTenant(tenantId);
	if(! Boolean(tenant.rooms[roomId])) {
		tenant.rooms[roomId] = this.getPlainRoom();
		if(opt_password) {
			tenant.rooms[roomId].password = opt_password;
			if(opt_visitable) {
				tenant.rooms[roomId].isVisitable = opt_visitable;
			}
		}
	}
	tenant.rooms[roomId].lastAccess = (new Date()).getTime();
	return tenant.rooms[roomId];	
};

LocalMemoryObjectDAO.prototype.getPlainRoom = function() {
	return {
		objects: {},
		map: {
			imageSource: 'https://shunshun94.github.io/manaT/images/background.jpg',
			xMax: 32,
			yMax: 18
		}};
};

LocalMemoryObjectDAO.prototype.getHashedPassword = function(tenantId, roomId) {
	var room = this.getRoom(tenantId, roomId);
	return {
		password: room.password,
		isVisitable: room.isVisitable || false
	};
};

LocalMemoryObjectDAO.prototype.isPermitted = function(tenantId, roomId, hashedPassword, opt_isRead) {
	var isRead = opt_isRead || false;
	var roomStatus = this.getHashedPassword(tenantId, roomId);
	
	if( !(Boolean(roomStatus.password)) || (roomStatus.isVisitable && isRead) || (hashedPassword === roomStatus.password)) {
		return true;
	}
	
	throw 'Manat:passwordMismatch';
};


LocalMemoryObjectDAO.prototype.addCharacter = function(characterData, tenantId, roomId, opt_password, opt_isVisitable) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password);
	if(room.objects[characterData.name]) {
		throw 'Manat:キャラクターの追加に失敗しました。同じ名前のキャラクターがすでに存在しないか確認してください。"' + characterData.name + '"';
	}
	room.objects[characterData.name] = characterData;
	room.objects[characterData.name].lastUpdate = (new Date()).getTime();
	room.lastUpdate = (new Date()).getTime();
};

LocalMemoryObjectDAO.prototype.changeCharacter = function(characterData, tenantId, roomId, opt_password, opt_isVisitable) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password);
	if(! Boolean(room.objects[characterData.targetName])) {
		throw 'Manat:「' + characterData.targetName + '」という名前のキャラクターは存在しません';
	}
	if(Boolean(characterData.name)) {
		if(room.objects[characterData.name]) {
			throw 'Manat:「' + characterData.name + '」という名前のキャラクターはすでに存在しています';
		}
		room.objects[characterData.name] = room.objects[characterData.targetName];
		delete room.objects[characterData.targetName];
	}
	
	var name = characterData.name || characterData.targetName
	
	for(var key in characterData) {
		room.objects[name][key] = characterData[key];
	}
	room.objects[name].lastUpdate = (new Date()).getTime();
	room.lastUpdate = (new Date()).getTime();

	return room.objects[name];
};

LocalMemoryObjectDAO.prototype.updateCharacter = function(characterData, tenantId, roomId, opt_password, opt_isVisitable) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password);
	if(! Boolean(room.objects[characterData.targetName])) {
		throw 'Manat:「' + characterData.targetName + '」という名前のキャラクターは存在しません';
	}
	if(Boolean(characterData.name)) {
		if(room.objects[characterData.name]) {
			throw 'Manat:「' + characterData.name + '」という名前のキャラクターはすでに存在しています';
		}
		room.objects[characterData.name] = room.objects[characterData.targetName];
		delete room.objects[characterData.targetName];
	}
	
	var name = characterData.name || characterData.targetName
	
	for(var key in characterData) {
		if(['counters', 'statusAlias'].indexOf(key) > -1) {
			for(var ckey in characterData[key]) {
				room.objects[name][key][ckey] = characterData[key][ckey];
			}
		} else {
			room.objects[name][key] = characterData[key];
		}
	}
	room.objects[name].lastUpdate = (new Date()).getTime();
	room.lastUpdate = (new Date()).getTime();

	return room.objects[name];
};

LocalMemoryObjectDAO.prototype.getCharacter = function(targetName, tenantId, roomId, opt_password, opt_isVisitable) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password, true);
	if(room.objects[targetName]) {
		return room.objects[targetName];
	} else {
		throw 'Manat:「' + targetName + '」という名前のキャラクターは存在しません'
	}
};

LocalMemoryObjectDAO.prototype.getCharacters = function(time, tenantId, roomId, opt_password, opt_isVisitable) {
	var result = this.getObjects(time, tenantId, roomId, opt_password, opt_isVisitable, function(character) {
		return character.type === 'characterData';
	});
	return result;
};

LocalMemoryObjectDAO.prototype.removeObject = function(targetName, tenantId, roomId, opt_password, opt_isVisitable) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password);
	if(room.objects[targetName]) {
		delete room.objects[targetName];
		room.lastUpdate = (new Date()).getTime();
	} else {
		throw {
			msg: 'Not found 「' + targetName + '」',
			target: targetName
		};
	}
};

LocalMemoryObjectDAO.prototype.getMap = function(time, tenantId, roomId, opt_password, opt_isVisitable, opt_filter) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password, true);
	return {mapData: room.map, lastUpdateTimes: {map: room.lastUpdate}};
};

LocalMemoryObjectDAO.prototype.setMap = function(map, tenantId, roomId, opt_password, opt_isVisitable, opt_filter) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password);
	for(var key in map) {
		room.map[key] = map[key];
	}
	return room.map;
};

LocalMemoryObjectDAO.prototype.getObjects = function(time, tenantId, roomId, opt_password, opt_isVisitable, opt_filter) {
	var filter = opt_filter || function(){return true};
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password, true);
	var result = [];
	var lastUpdate = time;
	for(name in room.objects) {
		if(filter(room.objects[name]) && room.objects[name].lastUpdate > time) {
			result.push(room.objects[name]);
		}
	}
	
	return {characters: result, lastUpdateTimes: {characters: room.lastUpdate}};
};

LocalMemoryObjectDAO.prototype.addObject = function(object, tenantId, roomId, opt_password, opt_isVisitable) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password);
	if(room.objects[object.imgId]) {
		throw 'Manat:' + object.type + 'の追加に失敗しました。' + object.type + ' の ID が重複しています"' + object.imgId + '"';
	}
	room.objects[object.imgId] = object;
	room.objects[object.imgId].lastUpdate = (new Date()).getTime();
	room.lastUpdate = (new Date()).getTime();
	
	return room.objects[object.imgId];
};

LocalMemoryObjectDAO.prototype.changeObject = function(object, tenantId, roomId, opt_password, opt_isVisitable) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password);
	if(! Boolean(room.objects[object.imgId])) {
		throw 'Manat:「' + object.imgId + '」が見つかりませんでした';
	}
	
	for(var key in object) {
		room.objects[object.imgId][key] = object[key];
	}
	room.objects[object.imgId].lastUpdate = (new Date()).getTime();
	room.lastUpdate = (new Date()).getTime();
	
	return room.objects[object.imgId];
};

LocalMemoryObjectDAO.prototype.getMemos = function(time, tenantId, roomId, opt_password, opt_isVisitable, opt_filter) {
	var result = this.getObjects(time, tenantId, roomId, opt_password, opt_isVisitable, function(character) {
		return character.type === 'memo';
	});
	return result.characters;
};


LocalMemoryObjectDAO.prototype.getAll = function() {
	return this.store;
};

LocalMemoryObjectDAO.prototype.removeAll = function(lastUpdate) {
	for(tenantId in this.store) {
		if(this.store[tenantId].lastAccess < lastUpdate) {
			delete this.store[tenantId];
		}
	}
};

LocalMemoryObjectDAO.prototype.restoreFromDump = function(dump) {
	this.store = dump.data;
};

module.exports = LocalMemoryObjectDAO;
