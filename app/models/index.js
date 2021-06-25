const dbConfig = require("../config/db.config.js");

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // },
    logging: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, DataTypes);
db.partner = require("./partner.model.js")(sequelize, DataTypes);
db.restaurant = require("./restaurant.model.js")(sequelize, DataTypes);
db.category = require("./category.model")(sequelize, DataTypes);
db.dish = require("./dish.model.js")(sequelize, DataTypes);
db.address = require("./address.model.js")(sequelize, DataTypes);
db.order = require("./order.model")(sequelize, DataTypes);
db.payment = require("./payment.model")(sequelize, DataTypes);


// Setting relationships

//1. Many to One relationships
db.user.hasMany(db.address, { foreignKey : 'user_id' });
db.address.belongsTo(db.user, { foreignKey : 'user_id' });

db.restaurant.hasMany(db.dish, { foreignKey: 'restaurant_id' });
db.dish.belongsTo(db.restaurant, { foreignKey: 'restaurant_id' });

db.user.hasMany(db.order, { foreignKey : 'user_id' });
db.order.belongsTo(db.user, { foreignKey : 'user_id' });

db.order.belongsTo(db.address, { foreignKey : 'address_id' });

//2. Many to Many relationships
db.dish.belongsToMany(db.order, {
    through: "order_dish",
    foreignKey: "dish_id",
});
db.order.belongsToMany(db.dish, {
    through: "order_dish",
    foreignKey: "order_id",
});

db.restaurant.belongsToMany(db.category, {
    through: "category_restaurant",
    foreignKey: "restaurant_id",
});
db.category.belongsToMany(db.restaurant, {
    through: "category_restaurant",
    foreignKey: "category_id",
});

module.exports = db;
