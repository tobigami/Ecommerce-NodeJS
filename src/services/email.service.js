const { BadRequestError } = require('../core/error.response');
const {
	getScheduleEmailById,
	getScheduleEmailCanSend,
} = require('../models/repositories/email.repo');

class EmailService {
	static async sendEmail(id) {
		try {
			const emailInfo = await getScheduleEmailCanSend(id);

			console.log('emailInfo :>> ', emailInfo);

			if (!emailInfo) {
				throw new BadRequestError('Email not found');
			}

			console.log(`[MOCK EMAIL SERVICE] Sending email:
				From: ${emailInfo.from_email}
				To: ${emailInfo.to_email}
				Subject: ${emailInfo.subject}
				Body: ${emailInfo.body}
				Status: Simulating email sending...
			`);

			const randomTime = Math.ceil(Math.random() * 1000);

			// Giả lập thời gian gửi email
			await new Promise((resolve) => setTimeout(resolve, randomTime));

			// Cập nhật trạng thái email thành 'sent'
			await emailInfo.update({ status: 'sent' });

			// Trả về thông tin email đã gửi
			return {
				success: true,
				emailInfo: emailInfo.toJSON(),
				sentAt: new Date(),
				message: 'Email sent successfully (simulated)',
			};
		} catch (error) {
			console.error('Email sending failed:', error);
			throw error;
		}
	}
}

module.exports = EmailService;
