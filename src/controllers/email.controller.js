const { SuccessResponse } = require('../core/success.response');
const EmailService = require('../services/email.service');

class EmailController {
	sendEmail = async (req, res) => {
		return new SuccessResponse({
			message: 'Email sent successfully',
			metadata: await EmailService.sendEmail(req.body.id),
		}).send(res);
	};

	addScheduleEmail = async (req, res) => {
		return new SuccessResponse({
			message: 'Email scheduled successfully',
			metadata: await EmailService.addScheduleEmail(req.body),
		}).send(res);
	};

	/**
	 *
	 * @param {*} req
	 * @param {*} res
	 * @returns
	 */
	getListJob = async (_, res) => {
		return new SuccessResponse({
			message: 'List of scheduled emails',
			metadata: await EmailService.getListJob(),
		}).send(res);
	};

	updateScheduleEmail = async (req, res) => {
		return new SuccessResponse({
			message: 'Email schedule updated successfully',
			metadata: await EmailService.updateScheduleEmail(req.params.id, req.body),
		}).send(res);
	};
}

module.exports = new EmailController();
