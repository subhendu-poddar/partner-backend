const db = require("../models");

const Restaurant = db.restaurant;
const Category = db.category;
const Dish = db.dish;
const Op = db.Sequelize.Op;
const Order = db.order;
const scrapRestaurant = require('../service/scrapping');

// Create and Save a new Restaurant
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.category || !req.body.rating || !req.body.location) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const existRes = await Restaurant.findOne({
        where: {
            name: req.body.name,
        }
    })

    if(existRes) {
        res.status(400).send({
            message: "Restaurant is already exist!"
        });
        return;
    }

    // Create a Restaurant
    const restaurant = {
        name: req.body.name,
        category: req.body.category,
        location: req.body.location,
        rating: req.body.rating,
        partnerId: req.partnerId
    };

    // Save Restaurant in the database
    Restaurant.create(restaurant)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while Adding the Restaurant."
            });
        });
};

// Retrieve all Restaurants from the database.
exports.findAll = (req, res) => {
    const title = req.query.name;
    const condition = title ? { name: { [Op.iLike]: `%${title}%` } } : null;

    Restaurant.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving restaurants."
            });
        });
};

// Find a single Restaurant with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Restaurant.findOne({
        where: {id: id},
        include: [{
            model: Dish
        }]
    }).then(data => {
            if(!data)
            {
                res.status(404).send({
                    message: `Restaurant with id=${id} was not found`
                });
            }
            else {
                res.send(data);
            }
        })
        .catch(err => {
            console.log("hel"+err)
            res.status(500).send({
                message: "Error retrieving Restaurant with id=" + id
            });
        });
};

// Update a Restaurant by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Restaurant.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num[0] === 1) {
                res.send({
                    message: "Restaurant was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Restaurant with id=${id}. Maybe Restaurant was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Restaurant with id=" + id
            });
        });
};

// Delete a Restaurant with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Restaurant.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Restaurant was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Restaurant with id=${id}. Maybe Restaurant was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Restaurant with id=" + id
            });
        });
};

// Delete all Restaurants from the database.
exports.deleteAll = (req, res) => {
    Restaurant.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Restaurants were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Restaurants."
            });
        });
};

// Add a Restaurant by the Link of Zomato or Swiggy
exports.createByLink = async (req, res) => {
    const restaurant = await scrapRestaurant(req.body.url);

    if(restaurant.error) {
        return res.status(500).send({
            message: "Invalid Link, Please check link and try again!"
        });
    }

    let res_id;

    const existRes = await Restaurant.findOne({
        where: {
            name: restaurant.name,
        }
    });

    if(existRes)
    {
        res_id = parseInt(existRes.id);
    }
    else
    {
        // Create Categories
        restaurant.categories.map(async category => {
            await Category.findOne({
                where: {
                    name: category
                }
            }).then(async (data) => {
                if (!data)
                {
                    await Category.create({ name: category })
                        .then()
                        .catch((err) => {
                            return res.status(500).send({
                                message: "Some error occurred while Adding the Scraped Categories.",
                                description: err
                            });
                        });
                }
            }).catch((err) => {
                return res.status(500).send({
                    message: "Some error occurred while Adding the Scraped Categories.",
                    description: err
                });
            });
        });

        // Create a Restaurant
        const newRestaurant = {
            name: restaurant.name,
            location: restaurant.location,
            rating: parseFloat(restaurant.rating),
            city: restaurant.city,
            partnerId: req.partnerId,
            image_url: restaurant.image
        };

        // Save Restaurant in the database
        await Restaurant.create(newRestaurant)
            .then(async newRes => {
                res_id = newRes.dataValues.id;
                restaurant.categories.map(async category => {
                    await Category.findOne({
                        where: {
                            name: category
                        }
                    }).then(async (category) => {
                        await newRes.addCategory(category);
                    }).catch((err) => {
                        return res.status(500).send({
                            message: "Some error occurred while Adding category to the Scraped Restaurant.",
                            description: err
                        });
                    });

                });
            }).catch (err => {
                return res.status(500).send({
                    message: "Some error occurred while Adding the Scraped Restaurant.",
                    description: err
                });
            });
    }

    // Adding Dishes to the Database
    await restaurant.items.filter(async (my_dish) => {

        let dishNotExists = true;

        await Dish.findOne({
            where: {
                dish_name: my_dish.name,
                restaurant_id: res_id,
            }
        }).then(() => {
            dishNotExists = false;
        }).catch(() => {
            dishNotExists = true;
        });

        return dishNotExists;

    }).map(async (my_dish) => {

        const new_dish = {
            dish_name: my_dish.name,
            dish_type: my_dish.type,
            dish_price: my_dish.price,
            image_url: my_dish.image_url,
            restaurant_id: res_id,
        }

        await Dish.create(new_dish)
            .then()
            .catch((err) => {
                return res.status(500).send({
                    message: "Some error occurred while Adding the scraped Dish.",
                    description: err
                });
            });
    })

    return res.status(200).send({
        message: "Adding Restaurant is Successful..!"
    });
}

// toggle accept-order
exports.toggleAcceptOrder = async(req, res) => {
    const restaurantId = req.params.id;

    try {
        const before = await Restaurant.findOne({
            where: {
                id: restaurantId
            }
        });

        if (!before.dataValues) {
            res.status(400).send({
                success: false,
                message:
                    "Restaurant doesn't exists!! "
            })

        } else {

            const previousState = before.dataValues.accepts_order;

            const updated = await Restaurant.update({ accepts_order: !previousState }, {
                where: {
                    id: restaurantId
                }
            })

            if (!updated) {
                res.status(400).send({
                    success: false,
                    message:
                        "Some Problem occurred while changing toggle."
                })

            } else {

                res.status(200).send({
                    success: true,
                    message:
                        `Accepts_Order changed to ${!previousState} toggled successfully`
                })
            }
        }
    
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 
                'Some error occurred in Changing Accepts_Order Option.',
            description: err
        });
    }
    
}

// retrieve orders of a restaurant * order status and restaurant_id is given
exports.retrieveOrders = async (req, res) => {
    const restaurantId = req.params.id; // getting restaurant Id
    const currentStatus = req.params.status; // pending orders or completed orders

    if (currentStatus !== "received" && currentStatus !== "preparing" && currentStatus !== "packing" && currentStatus !== "out_for_delivery" && currentStatus !== "completed" && currentStatus!== "all") {     // null status means all the orders
                                                                                        // irrespective of category
        return res.status(400).send({
            message:
                `Invalid status. There is no ${currentStatus} option.`
        });
    }
    
    if (currentStatus === "all") {
        try {
            const data = await Order.findAll({
                where: {
                    restaurant_id: restaurantId
                }
            })

            if (data.length > 0) {
                return res.status(200).json(data);
                
            } else {
                return res.status(400).send({
                    message:
                        `Sorry !! No ${currentStatus === "all" ? null : currentStatus} orders available right now.`
                });
            }

        } catch (err) {
            return res.status(500).send({
                message: `Some error occurred in retrieving ${currentStatus === "all" ? null : currentStatus} orders.`,
                description: err
            });
        }
    }

    else{
        try {
            const data = await Order.findAll({
                where: {
                    restaurant_id: restaurantId,
                    status: currentStatus
                }
            })
            
            if (data.length > 0) {
                return res.status(200).json(data);

            } else {
                return res.status(400).send({
                    message:
                        `No ${currentStatus === "all" ? null : currentStatus} orders are available right now.`
                });
            }

        } catch (err) {
            return res.status(500).send({
                message: `Some error occurred in retrieving ${currentStatus === "all" ? null : currentStatus} orders.`,
                description: err
            });
        }
    }

}

// retrieve Orders for the given Date Interval
exports.pastOrders = async(req, res) => {

    const restaurantId = req.params.id;

    try {
        const data = await Order.findAll({
            where: {
                restaurant_id: restaurantId,
                created_at: {
                    $gte: req.body.startDate,
                    $lt: req.body.endDate
                }
            }
        })
        if(data.length === 0){
            res.send({
                message:
                    `No Orders found between ${req.body.startDate} and ${req.body.endDate}.`
            })
        }
        else{
            res.status(200).json(data);
        }
    
    } catch (err) {
        return res.status(500).send({
            message: `Some error occurred while retrieving orders between ${req.body.startDate} and ${req.body.endDate}.`,
            description: err
        });
    }

}