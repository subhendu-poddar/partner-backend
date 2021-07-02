const db = require("../models");

const Payment = db.payment;
const Order = db.order;

// Create and Save a new Order
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.orderId || !req.body.gatewayId || !req.body.gateway) {
        return res.status(400).send({
            message: "OrderId or Gateway can not be empty!"
        });
    }

    try {
        var order = await Order.findOne({
            where: {
                id: req.body.orderId
            }
        })

        if(!order){
            return res.status(400).send({
                message:
                    `Order doesn't exist.`
            })
        }

        console.log(order.dataValues.total_price);

        var found = await Payment.findOne({
            where: {
                orderId: req.body.orderId
            }
        })
        console.log(found);

        if(found){
            return res.status(400).send({
                message:
                    `Payment for the orderId ${req.body.orderId} already exists.`
            })

        } else {

            const payment = {
                amount: order.dataValues.total_price,
                orderId: req.body.orderId,
                gatewayId: req.body.gatewayId,
                gateway: req.body.gateway
            }

            const data = await Payment.create(payment);

            if(data) {
                return res.status(200).send({
                    message:
                        `Payment with the orderId ${req.body.orderId} created successfully.`
                })
            }
            else{
                return res.status(400).send({
                    message:
                        `Error while creating the payment with order id ${req.body.orderId}.`
                })
            }

        }
    } catch (err) {
        return res.status(500).send({
            message: 'Some error occurred.',
            description: err
        });
    }
    
};

// Fetch all Payments from the database.
exports.getAll = async (req, res) => {

    try {
        const data = await Payment.findAll({
            where: {}
        });

        return res.send(data);
    }
    catch (err) {
        return res.status(500).send({
            message: "Some error occurred while fetching Payments.",
            description: err
        });
    }
};

// Find a single Payment with an id
exports.getOne = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Payment.findOne({
            where: { id: id }
        });

        if (!data) {
            return res.status(404).send({
                message: `Payment with id=${id} was not found`
            });
        }
        else {
            return res.send(data);
        }
    }
    catch (err) {
        return res.status(500).send({
            message: "Error retrieving Order with id=" + id,
            description: err
        });
    }
};

// Update a Payment by the id in the request 
exports.update = (req, res) => {
    const id = req.params.id;

    Payment.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num[0] === 1) {
                res.send({
                    message: "Payment was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Payment with id=${id}. Maybe Payment was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Payment with id=" + id
            });
        });
};

// Delete a Order with the specified id in the request
exports.deleteOne = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Payment.destroy({
            where: { id: id }
        });

        if (data === 1) {
            return res.send({
                message: "Payment was deleted successfully!"
            });
        } else {
            return res.send({
                message: `Cannot delete Payment with id=${id}. Maybe Payment was not found!`
            });
        }
    }
    catch (err) {
        return res.status(500).send({
            message: `Could not delete Payment with id= + ${id}`,
            description: err
        });
    }
};

// Delete all Orders from the database.
exports.deleteAll = async (req, res) => {

    try {
        const payment = await Payment.destroy({
            where: {},
            truncate: false
        });

        return res.send({ message: `${payment} Payment were deleted successfully!` });
    }
    catch (err) {
        return res.status(500).send({
            message: "Some error occurred while removing all Payments.",
            description: err
        });
    }
};