module.exports = (sequelize, DataTypes) => {
    return sequelize.define("category", {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        }

    },
    {
        freezeTableName: true,
        underscored: true
    });
};
