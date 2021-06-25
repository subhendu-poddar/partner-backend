const { DISH_TYPES } = require("../utilities/constants");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("dish", {
        dish_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dish_type: {
            type: DataTypes.ENUM,
            values: [ DISH_TYPES.VEG, DISH_TYPES.NON_VEG ],
            allowNull: false,
        },
        dish_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        availability: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        availability_time: {
            type : DataTypes.INTEGER,
        },
        image_url: {
            type: DataTypes.TEXT,
            defaultValue: ''
        }
    },
    {
        freezeTableName: true,
        underscored: true
    });
};
