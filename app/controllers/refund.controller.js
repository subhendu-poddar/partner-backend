const db = require("../models");

const Payment = db.payment;
const Order = db.order;
const Refund = db.refund;

// Create and Save a new Order
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.orderId || !req.body.paymentId) {
        return res.status(400).send({
            message: "orderId or PaymentId can not be empty!"
        });
    }

    try {
        var order = await Order.findOne({
            where: {
                id: req.body.orderId
            }
        })

        if (!order) {
            return res.status(400).send({
                message:
                    `Order with order Id = ${req.body.orderId} doesn't exist.`
            })
        }

        var payment = await Payment.findOne({
            where: {
                paymentId : req.body.paymentId
            }
        })

        if (!payment) {
            return res.status(400).send({
                message:
                    `Payment with payment Id = ${req.body.paymentId} doesn't exists.`
            })

        } else {

            const refund = {
                orderId: req.body.orderId,
                paymentId: req.body.paymentId
            }

            const data = await Refund.create(refund);

            if (data) {
                return res.status(200).send({
                    message:
                        `Refund for the orderId = ${req.body.orderId} and payment Id = ${req.body.paymentId} created successfully.`
                })
            }
            else {
                return res.status(400).send({
                    message:
                        `Error while creating refund with orderId = ${req.body.orderId} and payment Id = ${req.body.paymentId}.`
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

// Fetch all Refund from the database.
exports.getAll = async (req, res) => {

    try {
        const data = await Refund.findAll({
            where: {}
        });

        if(data.length > 0){

            return res.status(200).send(data);
        } else {

            return res.status(400).send({
                message: `No Refunds data are there.`
            })
        }

    }
    catch (err) {
        return res.status(500).send({
            message: "Some error occurred while fetching Refunds.",
            description: err
        });
    }
};

// Find a single Refund with an id
exports.getOne = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Refund.findOne({
            where: { id: id }
        });

        if (!data) {
            return res.status(404).send({
                message: `Refund with id=${id} doesn't exist.`
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

    Refund.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num[0] === 1) {
                res.send({
                    message: "Refund was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Refund with id=${id}. Maybe Refund was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Refund with id=" + id
            });
        });
};

// Delete a Refund with the specified id in the request
exports.deleteOne = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Refund.destroy({
            where: { id: id }
        });

        if (data === 1) {
            return res.send({
                message: "Refund was deleted successfully!"
            });
        } else {
            return res.send({
                message: `Cannot delete Refund with id=${id}. Maybe Refund was not found!`
            });
        }
    }
    catch (err) {
        return res.status(500).send({
            message: `Could not delete Refund with id= + ${id}`,
            description: err
        });
    }
};

// Delete all Orders from the database.
exports.deleteAll = async (req, res) => {

    try {
        const refund = await Refund.destroy({
            where: {},
            truncate: false
        });

        return res.send({ message: `${refund} Refund were deleted successfully!` });
    }
    catch (err) {
        return res.status(500).send({
            message: "Some error occurred while removing all Refunds.",
            description: err
        });
    }
};