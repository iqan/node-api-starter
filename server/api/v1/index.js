const router = require('express').Router();

const healthcheckRoutes = require('./healthcheck');

router.use('/healthcheck', healthcheckRoutes);

module.exports = router;
