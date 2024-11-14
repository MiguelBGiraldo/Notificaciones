require('dotenv/config');
const { get } = require('env-var');


const envs = {

    PORT: get('PORT').required().asPortNumber(),
    MONGO_URL: get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),

}

module.exports = envs;



