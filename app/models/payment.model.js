module.exports = (sequelize, DataTypes) => {
    return sequelize.define("payment", {
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        orderId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isRefunded: {
            type: DataTypes.BOOLEAN,
            allowNull: false
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
