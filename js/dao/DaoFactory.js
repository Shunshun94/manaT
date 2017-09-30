const LocalMemoryObjectDAO = require('./LocalMemoryObjectDAO.js');

const DaoFactory = {};

DaoFactory.getObjectDao = function() {
	return new LocalMemoryObjectDAO();
};

module.exports = DaoFactory;
