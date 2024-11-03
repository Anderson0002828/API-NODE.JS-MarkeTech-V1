// routes/history.route.js

const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');

router.post('/register', historyController.registerSearch);

module.exports = router;
