const db = require("../models");

const Restaurant = db.restaurant;
const Dish = db.dish;
const Op = db.Sequelize.Op;

// Create and Save a new Dish
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.dish_name || !req.body.dish_type || !req.body.dish_price || !req.body.restaurant_id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const ExistRes = await Restaurant.findByPk(req.body.restaurant_id)

    if(!ExistRes) {
        res.status(400).send({
            message: "Restaurant does not Exist!"
        });
        return;
    }

    const existDish = await Dish.findOne({
        where: {
            dish_name: req.body.dish_name,
            restaurant_id: req.body.restaurant_id,
        }
    })

    if(existDish) {
        res.status(400).send({
            message: "Dish in Restaurant already exist"
        });
        return;
    }

    // Create a Dish
    const dish = {
        dish_name: req.body.dish_name,
        dish_type: req.body.dish_type,
        dish_price: req.body.dish_price,
        restaurant_id: req.body.restaurant_id,
    };

    // Save Dishes in the database
    Dish.create(dish)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while Adding the Dish.",
                description: err
            });
        });
};

// Retrieve all Dishes from the database.
exports.findAll = (req, res) => {
    const title = req.query.dish_name;
    const condition = title ? { dish_name: { [Op.iLike]: `%${title}%` } } : null;

    Dish.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while Retrieving the Dishes.",
                description: err
            });
        });
};

// Find a single Dish with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Dish.findByPk(id)
        .then(data => {
            if(!data)
            {
                res.status(404).send({
                    message: `Dish with id=${id} was not found`
                });
            }
            else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Dish with id=" + id,
                description: err
            });
        });
};

// Update a Dish by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Dish.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num[0] === 1) {
                res.send({
                    message: "Dish was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update dish with id=${id}. Maybe Dish was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Dish with id=" + id,
                description: err
            });
        });
};

// Delete a Dish with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Dish.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Dish was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Dish with id=${id}. Maybe Dish was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Dish with id=" + id,
                description: err
            });
        });
};

// Delete all Dishes from the database.
exports.deleteAll = (req, res) => {
    Dish.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Dishes were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while removing all dishes.",
                description: err
            });
        });
};
