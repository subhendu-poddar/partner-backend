module.exports = (sequelize, DataTypes) => {
    return sequelize.define("orders", {
        order_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        delivery_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        tax_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        total_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        restaurant_id: {
            type: DataTypes.FLOAT,
            allowNull: false // require: true
        },
        status: {
            type: DataTypes.STRING, // completed or pending
            defaultValue: "received"
        }
    },
    {
        freezeTableName: true,
        underscored: true
    });
};
