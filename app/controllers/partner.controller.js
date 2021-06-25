const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require("../models");
const jwtConfig = require("../config/jwt.config");
const { ROLES } = require("../utilities/constants");

const Partner = db.partner;

// Create and Save a new Partner
exports.signup = async (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password || !req.body.gstNumber || !req.body.address || !req.body.panCard) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    Partner.findOne({
        where: {
            email: req.body.email
        }
    }).then(function(user) {
        if (user) {
            res.status(400).send({
                message: "Partner with E-Mail Id already exists!"
            });
            return;
        } else {
            Partner.findOne({
                where: {
                    phone: req.body.phone
                }
            }).then(function(user) {
                if (user) {
                    res.status(400).send({
                        message: "Partner with Contact Number already exists!"
                    });
                    return;

                } else {
                    const partner = {
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        password: bcrypt.hashSync(req.body.password),
                        gstNumber: req.body.gstNumber,
                        address: req.body.address,
                        panCard: req.body.panCard,
                    }

                    // Save Partners in the database
                    Partner.create(partner)
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
                                    err.message || "Some error occurred while Adding the Partner."
                            });
                        });
                }
            });
        }
    });
};

// Allow Partner to Login
exports.signin = (req, res) => {
    // Validate request
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    Partner.findOne({
        where: {
            email: req.body.email
        }
    }).then(partner => {
        if (!partner) {
            return res.status(404).send({
                auth: false,
                message: 'Partner Not Found.',
            });
        }

        let passwordIsValid = bcrypt.compareSync(req.body.password, partner.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                auth: false,
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        let token = jwt.sign({
            id: partner.id,
            role: ROLES.PARTNER
        }, jwtConfig.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({
            auth: true,
            accessToken: token
        });

    }).catch(err => {
        res.status(500).send({
            message: 'Something went wrong.',
            description: err
        });
    });
}

// Delete a Partner with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Partner.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Partner was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Partner with id=${id}. Maybe Partner was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Partner with id=" + id,
                description: err
            });
        });
};

// Delete all Partners from the database.
exports.deleteAll = (req, res) => {
    Partner.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Partners were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while removing all Partners.",
                description: err
            });
        });
};

// Update a Partner by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Partner.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num[0] === 1) {
                res.status(200).send({
                    message: "Partner was updated successfully."
                });
            } else {
                res.status(400).send({
                    message: `Cannot update Partner with id=${id}. Maybe Partner was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Partner with id=" + id,
                description: err
            });
        });
};


// Retrieve all the Partners from the database.
exports.getAll = (req, res) => {
    const title = req.query.name;
    const condition = title ? { name: { [Op.iLike]: `%${title}%` } } : null;

    Partner.findAll({ where: condition })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Partners.",
                    description: err
            });
        });
};

// Find a particular Partner with an id
exports.getOne = (req, res) => {
    const id = req.params.id;

    Partner.findOne({
        where: { id: id }
    }).then(data => {
        if (!data) {
            res.status(404).send({
                message: `Partner with id=${id} was not found`
            });
        }
        else {
            res.status(200).send(data);
        }
    })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                message: "Error retrieving Partner with id=" + id,
                description: err
            });
        });
};

