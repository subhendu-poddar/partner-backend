module.exports = (sequelize, DataTypes) => {
    return sequelize.define("restaurant", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        accepts_order: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        restaurant_latitude: {
            type: DataTypes.FLOAT,
        },
        restaurant_longitude: {
            type: DataTypes.FLOAT,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        partnerId: {
            type: DataTypes.INTEGER,
        },
        verifiedStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        city: {
            type: DataTypes.STRING,
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
