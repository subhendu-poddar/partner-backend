module.exports = app => {
    const db = require("../controllers/db.controller");

    const router = require("express").Router();

    // Resets the Database
    router.post("/reset", db.reset);

    app.use('/api/db', router);
};
