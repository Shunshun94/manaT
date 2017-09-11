const ObjectDAO = function() {
	this.store = {};
};

ObjectDAO.prototype.getTenant = function(tenantId) {
	if(! Boolean(this.store[tenantId])) {
		this.store[tenantId] = {};
		this.store[tenantId].rooms = {};
	}
	this.store[tenantId].lastAccess = (new Date()).getTime();
	return this.store[tenantId];
};

ObjectDAO.prototype.getRoom = function(tenantId, roomId, opt_password, opt_visitable) {
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

ObjectDAO.prototype.getPlainRoom = function() {
	return {
		objects: {},
		map: {
			imageSource: 'https://shunshun94.github.io/manaT/images/background.jpg',
			xMax: 32,
			yMax: 18
		}};
};

ObjectDAO.prototype.getHashedPassword = function(tenantId, roomId) {
	var room = this.getRoom(tenantId, roomId);
	return {
		password: room.password,
		isVisitable: room.isVisitable || false
	};
};

ObjectDAO.prototype.isPermitted = function(tenantId, roomId, hashedPassword, opt_isRead) {
	var isRead = opt_isRead || false;
	var roomStatus = this.getHashedPassword(tenantId, roomId);
	
	if( !(Boolean(roomStatus.password)) || (roomStatus.isVisitable && isRead) || (hashedPassword === roomStatus.password)) {
		return true;
	}
	
	throw 'Manat:passwordMismatch';
};


ObjectDAO.prototype.addCharacter = function(characterData, tenantId, roomId, opt_password, opt_isVisitable) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password);
	if(room.objects[characterData.name]) {
		throw 'Manat:キャラクターの追加に失敗しました。同じ名前のキャラクターがすでに存在しないか確認してください。"' + characterData.name + '"';
	}
	room.objects[characterData.name] = characterData;
	room.objects[characterData.name].lastUpdate = (new Date()).getTime();
	room.lastUpdate = (new Date()).getTime();
};

ObjectDAO.prototype.changeCharacter = function(characterData, tenantId, roomId, opt_password, opt_isVisitable) {
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

ObjectDAO.prototype.updateCharacter = function(characterData, tenantId, roomId, opt_password, opt_isVisitable) {
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

ObjectDAO.prototype.removeCharacter = function(targetName, tenantId, roomId, opt_password, opt_isVisitable) {
	return this.removeObject(targetName, '「' + targetName + '」という名前のキャラクターは存在しません', tenantId, roomId, opt_password, opt_isVisitable);
};

ObjectDAO.prototype.getCharacter = function(targetName, tenantId, roomId, opt_password, opt_isVisitable) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password, true);
	if(room.objects[targetName]) {
		return room.objects[targetName];
	} else {
		throw 'Manat:「' + targetName + '」という名前のキャラクターは存在しません'
	}
};

ObjectDAO.prototype.getCharacters = function(time, tenantId, roomId, opt_password, opt_isVisitable) {
	var result = this.getObjects(time, tenantId, roomId, opt_password, opt_isVisitable, function(character) {
		return character.type === 'characterData';
	});
	return result;
};

ObjectDAO.prototype.removeObject = function(targetName, notFoundMessage, tenantId, roomId, opt_password, opt_isVisitable) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password);
	if(room.objects[targetName]) {
		delete room.objects[targetName];
		room.lastUpdate = (new Date()).getTime();
	} else {
		throw 'Manat:' + notFoundMessage;
	}
};

ObjectDAO.prototype.getMap = function(time, tenantId, roomId, opt_password, opt_isVisitable, opt_filter) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password, true);
	return {mapData: room.map, lastUpdateTimes: {map: room.lastUpdate}};
};

ObjectDAO.prototype.setMap = function(map, tenantId, roomId, opt_password, opt_isVisitable, opt_filter) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password);
	for(var key in map) {
		room.map[key] = map[key];
	}
	return room.map;
};

ObjectDAO.prototype.getObjects = function(time, tenantId, roomId, opt_password, opt_isVisitable, opt_filter) {
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

ObjectDAO.prototype.addMemo = function(memo, tenantId, roomId, opt_password, opt_isVisitable) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password);
	if(room.objects[memo.imgId]) {
		throw 'Manat:メモの追加に失敗しました。memo の ID が重複しています"' + memo.imgId + '"';
	}
	room.objects[memo.imgId] = memo;
	room.objects[memo.imgId].lastUpdate = (new Date()).getTime();
	room.lastUpdate = (new Date()).getTime();
	
	return room.objects[memo.imgId];
};

ObjectDAO.prototype.changeMemo = function(memo, tenantId, roomId, opt_password, opt_isVisitable) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password);
	if(! Boolean(room.objects[memo.imgId])) {
		throw 'Manat:「' + memo.imgId + '」が見つかりませんでした';
	}
	room.objects[memo.imgId].message = memo.message;
	room.objects[memo.imgId].lastUpdate = (new Date()).getTime();
	room.lastUpdate = (new Date()).getTime();
	
	return room.objects[memo.imgId];
};

ObjectDAO.prototype.removeMemo = function(targetName, tenantId, roomId, opt_password, opt_isVisitable) {
	return this.removeObject(targetName, '「' + targetName + '」が見つかりませんでした', tenantId, roomId, opt_password, opt_isVisitable);
};

ObjectDAO.prototype.getMemos = function(time, tenantId, roomId, opt_password, opt_isVisitable, opt_filter) {
	var result = this.getObjects(time, tenantId, roomId, opt_password, opt_isVisitable, function(character) {
		return character.type === 'memo';
	});
	return result.characters;
};


ObjectDAO.prototype.getAll = function() {
	return this.store;
};

ObjectDAO.prototype.removeAll = function(lastUpdate) {
	for(tenantId in this.store) {
		if(this.store[tenantId].lastAccess < lastUpdate) {
			delete this.store[tenantId];
		}
	}
};

ObjectDAO.prototype.restoreFromDump = function(dump) {
	this.store = dump.data;
};

module.exports = ObjectDAO;
