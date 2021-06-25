const db = require("../models");
const Address = db.address;

// Create and Save a new Address
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.alias || !req.body.landmark || !req.body.location || !req.body.type || !req.body.longitude || !req.body.latitude) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const ExistAddressAlias = await Address.findOne({
        where : {
            alias: req.body.alias.toUpperCase(),
            user_id: req.userId
        }
    })

    if(ExistAddressAlias) {
        return res.status(400).send({
            message: `Address with alias ${req.body.alias} already exists`
        });
    }

    // Create an Address
    const address = {
        alias: req.body.alias.toUpperCase(),
        landmark: req.body.landmark,
        type: req.body.type,
        location: req.body.location,
        user_id: req.userId,
        longitude: req.body.longitude,
        latitude: req.body.latitude
    };

    // Save Address in the database
    try {
        const data = await Address.create(address);
        return res.send(data);
    }
    catch (err) {
        return res.status(500).send({
            message: "Some error occurred while Adding the Address.",
            description: err
        });
    }
};

// Retrieve all Addresses from the database.
exports.findAll = async (req, res) => {
    try {
        const data = await Address.findAll({ where: {} });
        return res.send(data);
    }
    catch (err) {
        return res.status(500).send({
            message: "Some error occurred while Retrieving the Addresses.",
            description: err
        });
    }
};

// Find a single Address with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Address.findByPk(id);

        if (!data) {
            return res.status(404).send({
                message: `Address with id=${id} was not found`
            });
        }
        else {
            return res.send(data);
        }
    }
    catch (err) {
        return res.status(500).send({
            message: "Error retrieving Address with id=" + id,
            description: err
        });
    }
};

// Find all Address of loggedIn user
exports.findUsersAllAddress = async (req, res) => {
    const id = req.userId;

    try {
        const addresses = await Address.findAll({
            where: {
                user_id: id
            }
        });

        return res.send(addresses);
    }
    catch (err) {
        return res.status(500).send({
            message: "Error retrieving Addresses of user with id:" + id,
            description: err
        });
    }
};

// Update an Address by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    req.body.alias = req.body.alias.toUpperCase();

    try {
        const data = await Address.update(req.body, {
            where: { id: id }
        });

        if (data[0] === 1) {
            return  res.send({
                message: "Address was updated successfully."
            });
        }
        else {
            return res.send({
                message: `Cannot update Address with id=${id}. Maybe Address was not found or req.body is empty!`
            });
        }
    }
    catch (err) {
        return res.status(500).send({
            message: "Error updating Address with id=" + id,
            description: err
        });
    }
};

// Delete an Address with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Address.destroy({
            where: { id: id }
        });

        if (data === 1) {
            return res.send({
                message: "Address was deleted successfully!"
            });
        } else {
            return res.send({
                message: `Cannot delete Address with id=${id}. Maybe Address was not found!`
            });
        }

    }
    catch (err) {
        return res.status(500).send({
            message: "Could not delete Address with id=" + id,
            description: err
        });
    }
};

// Delete all Address from the database.
exports.deleteAll = async (req, res) => {

    try {
        const data = await Address.destroy({
            where: {},
            truncate: false
        });

        return res.send({ message: `${data} Addresses were deleted successfully!` });
    }
    catch (err) {
        return res.status(500).send({
            message: "Some error occurred while removing all Addresses.",
            description: err
        });
    }

};
