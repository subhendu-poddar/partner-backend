const authJwt = require('./auth/verifyJwtToken');
const { ROLES } = require("../utilities/constants");
const { permit } = require("./auth/authPermissions");

module.exports = app => {
    const dish = require("../controllers/dish.controller");

    const router = require("express").Router();

    // Create a new Dish
    router.post("/", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], */ dish.create);

    // Retrieve all Dishes
    router.get("/",/*  [authJwt.verifyJwtToken, permit(ROLES.PARTNER, ROLES.DEFAULT)], */ dish.findAll);

    // Retrieve a single Dish with id
    router.get("/:id",/*  [authJwt.verifyJwtToken, permit(ROLES.PARTNER, ROLES.DEFAULT)], */ dish.findOne);

    // Update a Dish with id
    router.put("/:id", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], */ dish.update);

    // Delete a Dish with id
    router.delete("/:id", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], */ dish.delete);

    // Delete all Dishes
    router.delete("/", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], */ dish.deleteAll);

    app.use('/api/dish', router);
};
