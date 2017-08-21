const ObjectDTO = function() {
	this.store = {};
};

ObjectDTO.prototype.getTenant = function(tenantId) {
	if(! Boolean(this.store[tenantId])) {
		this.store[tenantId] = {};
		this.store[tenantId].rooms = {};
	}
	this.store[tenantId].lastAccess = (new Date()).getTime();
	return this.store[tenantId];
};

ObjectDTO.prototype.getRoom = function(tenantId, roomId) {
	var tenant = this.getTenant(tenantId);
	if(! Boolean(tenant.rooms[roomId])) {
		tenant.rooms[roomId] = {objects: {}};
	}
	tenant.rooms[roomId].lastAccess = (new Date()).getTime();
	return tenant.rooms[roomId];	
}

ObjectDTO.prototype.addCharacter = function(characterData, tenantId, roomId) {
	var room = this.getRoom(tenantId, roomId);
	if(room.objects[characterData.name]) {
		throw 'キャラクターの追加に失敗しました。同じ名前のキャラクターがすでに存在しないか確認してください。"' + characterData.name + '"';
	}
	room.objects[characterData.name] = characterData;
};

ObjectDTO.prototype.getAll = function() {
	return this.store;
};


module.exports = ObjectDTO;
