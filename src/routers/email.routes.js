const express = require('express');

const EmailController = require('../controllers/email.controller');
const asyncHandler = require('../helper/asyncHandler');

const router = express.Router();

router.post('/send', asyncHandler(EmailController.sendEmail));

module.exports = router;
