
module.exports = app => {
    const refund = require("../controllers/refund.controller");

    const router = require("express").Router();

    router.post("/", refund.create);

    router.get("/:id", refund.getOne);

    router.get("/", refund.getAll);

    router.put("/:id", refund.update);

    router.delete("/:id", refund.deleteOne);

    router.delete("/", refund.deleteAll);

    app.use('/api/refund', router);
};
