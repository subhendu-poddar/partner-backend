const authJwt = require('./auth/verifyJwtToken');
const { ROLES } = require("../utilities/constants");
const { permit } = require("./auth/authPermissions");

module.exports = app => {
    const order = require("../controllers/order.controller");

    const router = require("express").Router();

    // Create a new Order
    router.post("/",/* [authJwt.verifyJwtToken, permit(ROLES.DEFAULT)], */ order.create);

    // Retrieve all Orders
    router.get("/", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER, ROLES.DEFAULT)], */ order.findAll);

    // Retrieve a single Order with id
    router.get("/:id", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER, ROLES.DEFAULT)], */ order.findOne);

    // Delete a Order with id
    router.delete("/:id", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER, ROLES.DEFAULT)], */ order.delete);

    // Delete all Orders
    router.delete("/", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], */ order.deleteAll);

    // update an order (this) includes process also
    router.put("/:id", order.update);

    app.use('/api/order', router);
};
