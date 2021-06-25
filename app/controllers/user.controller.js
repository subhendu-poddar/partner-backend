const jwt = require('jsonwebtoken');

const db = require("../models");
const jwtConfig = require("../config/jwt.config");
const { ROLES } = require("../utilities/constants");

const User = db.user;
const Order = db.order;

// Create and Save a new User
exports.signup = async (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.email || !req.body.phone) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(function(user) {
        if (user) {
            res.status(400).send({
                message: "User with E-Mail Id already exists!"
            });
            return;
        } else {
            User.findOne({
                where: {
                    phone: req.body.phone
                }
            }).then(function(user) {
                if (user) {
                    res.status(400).send({
                        message: "User with Contact Number already exists!"
                    });
                    return;

                } else {
                    const user = {
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone
                    }

                    // Save Users in the database
                    User.create(user)
                        .then(data => {
                            res.send({
                                name: data.name,
                                email: data.email,
                                phone: data.phone
                            });
                        })
                        .catch(err => {
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while Adding the User."
                            });
                        });
                }
            });
        }
    });
};

// Allow User to Login
exports.signin = async (req, res) => {
    // Validate request
    if (!req.body.phone) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    try {
        const user = await User.findOne({
            where: {
                phone: req.body.phone
            }
        })

        if (!user) {
            return res.status(404).send({
                auth: false,
                message: 'User Not Found.',
            });
        }

        let token = jwt.sign({ id: user.id, role: ROLES.DEFAULT }, jwtConfig.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            auth: true,
            accessToken: token
        });
    }
    catch (err) {
        res.status(500).send({
            message: 'Something went wrong.',
            description: err
        });
    }
}

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id,
                description: err
            });
        });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Users were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while removing all Users.",
                description: err
            });
        });
};

// Allow user to get recent Search
exports.recentSearch = async(req, res) => {
    try {
        const id = req.params.id
        // const text = " select * from orders where orders.customer_id = $1 order by created_at desc limit 5"

        const data = await Order.find({order_id: id}).sort({created_at:-1}).limit(3);
        if (data.rows > 0) {
            res.status(200).json(data.rows);
        }
        else {
            res.status(400).send({ 
                message: `No datas available to fetch !!` });
        }
    } catch (err) {
        res.status(500).send({
            message: "Some error occurred fetching datas.",
            description: err
        });
    }
}