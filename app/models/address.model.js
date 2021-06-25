const { ADDRESS_TYPE } = require("../utilities/constants");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("address", {
        alias: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM,
            values: [ ADDRESS_TYPE.HOME, ADDRESS_TYPE.OFFICE, ADDRESS_TYPE.OTHER ],
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        landmark: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        underscored: true
    });
};
