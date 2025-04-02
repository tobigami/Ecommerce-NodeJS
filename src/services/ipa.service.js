'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_KEY } = process.env;

class IpaService {
	static async getIpa({ ipa }) {
		try {
			const genAI = new GoogleGenerativeAI(GEMINI_KEY);
			const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

			const prompt = `Give me a JSON list of 20 English words that contain the IPA sound '${ipa}'.
                      Each object in the list should have the keys "word", "ipa", and "meaning" with their corresponding values.
                      Ensure the response is plain JSON without any markdown formatting like backticks.
                      Format: [{"word": "example", "ipa": "ˈɛɡzæmpəl", "meaning": "a representative form"}]`;

			const result = await model.generateContent(prompt);
			const response = result.response.text(); // Lấy kết quả từ AI
			console.log('response :>> ', response);
			return JSON.parse(response); // Trả về JSON format
		} catch (error) {
			console.error('Gemini API error:', error);
			return { error: 'Failed to fetch words from Gemini API.' };
		}
	}
}

module.exports = IpaService;
