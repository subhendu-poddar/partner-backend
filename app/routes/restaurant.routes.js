const authJwt = require('./auth/verifyJwtToken');
const { ROLES } = require("../utilities/constants");
const { permit } = require("./auth/authPermissions");

module.exports = app => {
    const restaurant = require("../controllers/restaurant.controller");

    const router = require("express").Router();

    // Create a new Restaurant
    router.post("/",[authJwt.verifyJwtToken, permit(ROLES.PARTNER)], restaurant.create);
    // router.post("/create-restaurant", restaurant.create);

    // Retrieve all Restaurants
    // router.get("/", [authJwt.verifyJwtToken, permit(roles.PARTNER, roles.DEFAULT)], restaurant.findAll);
    router.get("/", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], restaurant.findAll);

    // Add Restaurant using Zomato/ Swiggy Link
    router.post("/link", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], restaurant.createByLink);
    // router.post("/link", [authJwt.verifyJwtToken, permit(roles.PARTNER)], restaurant.createByLink);

    // Retrieve a single Restaurant with id
    // router.get("/:id", [authJwt.verifyJwtToken, permit(roles.PARTNER, roles.DEFAULT)], restaurant.findOne);
    router.get("/:id", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], restaurant.findOne);

    // Update a Restaurant with id
    router.put("/:id", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], restaurant.update);

    // Delete a Restaurant with id
    router.delete("/:id", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], restaurant.delete);

    // Delete all Restaurants
    router.delete("/", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], restaurant.deleteAll);

    // toggling accept-order option
    router.put("/:id/toggle", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], restaurant.toggleAcceptOrder);

    // retrieve orders of a restaurant
    router.get("/:id/retrieve/:status", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], restaurant.retrieveOrders);

    // retrieve pastOrders for a given date interval
    router.get("/:id/pastOrders", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], restaurant.pastOrders);

    app.use('/api/restaurant', router);
};
