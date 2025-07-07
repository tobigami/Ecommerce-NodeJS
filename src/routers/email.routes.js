const express = require('express');

const EmailController = require('../controllers/email.controller');
const asyncHandler = require('../helper/asyncHandler');

const router = express.Router();

// GET
router.get('/list-job', asyncHandler(EmailController.getListJob));

// POST
router.post('/send', asyncHandler(EmailController.sendEmail));
router.post('/add', asyncHandler(EmailController.addScheduleEmail));

// PATCH
router.patch('/update/:id', asyncHandler(EmailController.updateScheduleEmail));

module.exports = router;
