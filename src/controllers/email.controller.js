const { SuccessResponse } = require('../core/success.response');
const EmailService = require('../services/email.service');

class EmailController {
	sendEmail = async (req, res) => {
		return new SuccessResponse({
			message: 'Email sent successfully',
			metadata: await EmailService.sendEmail(req.body.id),
		}).send(res);
	};
}

module.exports = new EmailController();
