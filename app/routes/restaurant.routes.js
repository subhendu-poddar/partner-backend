const authJwt = require('./auth/verifyJwtToken');
const { ROLES } = require("../utilities/constants");
const { permit } = require("./auth/authPermissions");

module.exports = app => {
    const restaurant = require("../controllers/restaurant.controller");

    const router = require("express").Router();

    // Create a new Restaurant
    router.post("/",/* [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], */ restaurant.create);
    // router.post("/create-restaurant", restaurant.create);

    // Retrieve all Restaurants
    // router.get("/", [authJwt.verifyJwtToken, permit(roles.PARTNER, roles.DEFAULT)], restaurant.findAll);
    router.get("/", restaurant.findAll);

    // Add Restaurant using Zomato/ Swiggy Link
    router.post("/link", restaurant.createByLink);
    // router.post("/link", [authJwt.verifyJwtToken, permit(roles.PARTNER)], restaurant.createByLink);

    // Retrieve a single Restaurant with id
    // router.get("/:id", [authJwt.verifyJwtToken, permit(roles.PARTNER, roles.DEFAULT)], restaurant.findOne);
    router.get("/:id", restaurant.findOne);

    // Update a Restaurant with id
    router.put("/:id", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], */ restaurant.update);

    // Delete a Restaurant with id
    router.delete("/:id", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], */ restaurant.delete);

    // Delete all Restaurants
    router.delete("/", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], */ restaurant.deleteAll);

    // toggling accept-order option
    router.put("/:id/toggle", restaurant.toggleAcceptOrder);

    // retrieve orders of a restaurant
    router.get("/:id/retrieve/:status", restaurant.retrieveOrders);

    // retrieve pastOrders for a given date interval
    router.get("/:id/pastOrders", restaurant.pastOrders);

    app.use('/api/restaurant', router);
};
