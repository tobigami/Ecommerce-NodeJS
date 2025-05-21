const express = require('express');
const tarotController = require('../controllers/tarot.controller');

const asyncHandler = require('../helper/asyncHandler');

const router = express.Router();

router.post('/reading', asyncHandler(tarotController.reading));
router.post('/add-feedback', asyncHandler(tarotController.addFeedback));

module.exports = router;
