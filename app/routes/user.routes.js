module.exports = app => {
    const user = require("../controllers/user.controller");

    const router = require("express").Router();

    // Create a new User
    router.post("/signup", user.signup);

    // User SignIn
    router.post("/signin", user.signin);

    // Delete a User with id
    router.delete("/:id", user.delete);

    // Delete all Users
    router.delete("/", user.deleteAll);

    // get 3 recent food-items searched by user
    router.get("/recent-search", user.recentSearch);

    app.use('/api/user', router);
};
