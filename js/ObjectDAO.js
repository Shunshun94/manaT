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
		tenant.rooms[roomId] = {objects: {}};
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

ObjectDAO.prototype.removeCharacter = function(targetName, tenantId, roomId, opt_password, opt_isVisitable) {
	var room = this.getRoom(tenantId, roomId, opt_password, opt_isVisitable);
	this.isPermitted(tenantId, roomId, opt_password);
	if(room.objects[targetName]) {
		delete room.objects[targetName];
		room.lastUpdate = (new Date()).getTime();
	} else {
		throw 'Manat:「' + targetName + '」という名前のキャラクターは存在しません'
	}
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

module.exports = ObjectDAO;
