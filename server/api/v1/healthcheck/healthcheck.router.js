const router = require('express').Router();

const healthcheckController = require('./healthcheck.controller');

router.get('/', healthcheckController.healthcheck);

module.exports = router;