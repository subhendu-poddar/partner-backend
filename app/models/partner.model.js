module.exports = (sequelize, DataTypes) => {
    return sequelize.define("partner", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            isEmail: true,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isValidPhoneNo: function(value) {
                    if (!value) return value;

                    let regexp = /^[0-9]+$/;
                    let values = (Array.isArray(value)) ? value : [value];

                    values.forEach(function(val) {
                        if (!regexp.test(val)) {
                            throw new Error("Number only is allowed.");
                        }
                    });
                    return value;
                }
            }
        },
        password: {
            type : DataTypes.STRING,
            allowNull: false
        },
        gstNumber: {
            type : DataTypes.STRING,
            allowNull: false
        },
        address: {
            type : DataTypes.STRING,
            allowNull: false
        },
        panCard: {
            type : DataTypes.STRING,
            allowNull: false
        }, 
        created_at : {
            type: DataTypes.DATE, 
            default : DataTypes.NOW
        }
    },
    {
        freezeTableName: true,
        underscored: true
    });
};
