const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "postgres",
    DB: "food",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 3000000,
        idle: 500000
    }
};
