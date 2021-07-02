
module.exports = app => {
    const payment = require("../controllers/payment.controller");

    const router = require("express").Router();

    router.post("/", payment.create);

    router.get("/:id", payment.getOne);

    router.get("/", payment.getAll);

    router.put("/:id", payment.update);

    router.delete("/:id", payment.deleteOne);

    router.delete("/", payment.deleteAll);

    app.use('/api/payment', router);
};
