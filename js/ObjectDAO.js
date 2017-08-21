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
		isVisitable: room.isVisitable || true
	};
};

ObjectDAO.prototype.isPermitted = function(tenantId, roomId, hashedPassword, opt_isRead) {
	var isRead = opt_isRead || false;
	var roomStatus = this.getHashedPassword(tenantId, roomId);
	
	if((roomStatus.isVisitable && isRead) || (hashedPassword === roomStatus.password)) {
		return true;
	}
	
	throw 'passwordMismatch';
};



ObjectDAO.prototype.addCharacter = function(characterData, tenantId, roomId, password, isVisitable) {
	var room = this.getRoom(tenantId, roomId, password, isVisitable);
	this.isPermitted(tenantId, roomId, password);
	if(room.objects[characterData.name]) {
		throw 'キャラクターの追加に失敗しました。同じ名前のキャラクターがすでに存在しないか確認してください。"' + characterData.name + '"';
	}
	room.objects[characterData.name] = characterData;
};

ObjectDAO.prototype.getAll = function() {
	return this.store;
};


module.exports = ObjectDAO;
