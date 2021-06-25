const db = require("../models");
db.sequelize.sync({ force: true }).then(() => {
    console.log('Dropped DB and Re-sync It');
    process.exit();
});
