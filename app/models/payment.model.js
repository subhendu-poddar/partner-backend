module.exports = (sequelize, DataTypes) => {
    return sequelize.define("payment", {
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "initiated"
        },
        isRefunded: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        refundId: {
            type: DataTypes.INTEGER,
        },
        gateway: {
            type: DataTypes.STRING
        },
        gatewayId: {
            type: DataTypes.STRING
        }
    },
        {
            freezeTableName: true,
            underscored: true
        });
};
