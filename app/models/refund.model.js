module.exports = (sequelize, DataTypes) => {
    return sequelize.define("refund", {
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        paymentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "initiated"
        }
    },
        {
            freezeTableName: true,
            underscored: true
        });
};
