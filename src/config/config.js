const dotenv = require('dotenv');

dotenv.config();
module.exports = {
	URLDB: process.env.URLDB,
	APIKEY: process.env.APIKEY,
	PORT: process.env.PORT,
};
