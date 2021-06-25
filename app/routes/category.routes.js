const authJwt = require('./auth/verifyJwtToken');
const { ROLES } = require("../utilities/constants");
const { permit } = require("./auth/authPermissions");

module.exports = app => {
    const category = require("../controllers/category.controller");

    const router = require("express").Router();

    // Create a new Category
    router.post("/", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], category.create);

    // Retrieve all Categories
    router.get("/", [authJwt.verifyJwtToken, permit(ROLES.PARTNER, ROLES.DEFAULT)], category.findAll);

    // Retrieve a single Category with id
    router.get("/:id", [authJwt.verifyJwtToken, permit(ROLES.PARTNER, ROLES.DEFAULT)], category.findOne);

    // Update a Category with id
    router.put("/:id", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], category.update);

    // Delete a Category with id
    router.delete("/:id", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], category.delete);

    // Delete all Categories
    router.delete("/", [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], category.deleteAll);

    app.use('/api/category', router);
};
