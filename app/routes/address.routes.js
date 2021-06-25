const authJwt = require('./auth/verifyJwtToken');
const { ROLES } = require("../utilities/constants");
const { permit } = require("./auth/authPermissions");

module.exports = app => {
    const address = require("../controllers/address.controller");

    const router = require("express").Router();

    // Create a new Address
    router.post("/", /* [authJwt.verifyJwtToken, permit(ROLES.DEFAULT)], */ address.create);

    // Retrieve all Addresses
    router.get("/", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], */ address.findAll);

    // Retrieve all Address of loggedIn user
    router.get("/user", /* [authJwt.verifyJwtToken, permit(ROLES.DEFAULT)], */ address.findUsersAllAddress);

    // Retrieve a single Address with id
    router.get("/:id", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], */ address.findOne);

    // Update an Address with id
    router.put("/:id", /* [authJwt.verifyJwtToken, permit(ROLES.DEFAULT)], */ address.update);

    // Delete an Address with id
    router.delete("/:id", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER, ROLES.DEFAULT)], */ address.delete);

    // Delete all Addresses
    router.delete("/", /* [authJwt.verifyJwtToken, permit(ROLES.PARTNER)], */ address.deleteAll);

    app.use('/api/address', router);
};
