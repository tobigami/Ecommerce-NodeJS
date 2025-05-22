'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_KEY } = process.env;
const { addTarotFeedback, tarotAdd } = require('../models/repositories/tarot.repo');

class TarotService {
	static async reading({ question, cards, ip, name, age, isDev }) {
		// Define the prompt as a template literal (backtick string)
		const prompt = `Bạn là chuyên gia giải bài Tarot. 
		Trước tiên, hãy đánh giá câu hỏi đầu vào.
		Nếu câu hỏi là một chuỗi ký tự vô nghĩa, không tạo thành một câu hỏi có ý nghĩa bằng tiếng Việt (ví dụ: "asdfgh", "12345", "???!!!") hoặc không thể hiểu được, hãy trả về một object với định dạng sau:
		{
			meaningCard1: null,
			meaningCard2: null,
			meaningCard3: null,
			meaningCard4: null,
			meaningCard5: null,
			overAll: "Câu hỏi của bạn không rõ ràng hoặc không có ý nghĩa. Vui lòng đặt một câu hỏi cụ thể bằng tiếng Việt để được giải bài Tarot. 😔"
		}

		Nếu câu hỏi có ý nghĩa, dựa trên câu hỏi và danh sách các lá bài dưới đây, hãy cung cấp phần giải nghĩa thật chi tiết
		sâu sắc và dài cho từng lá bài (bao gồm cả vị trí xuôi/ngược) và một phần tổng kết tổng quan.
		Luôn trả lời bằng tiếng Việt và trả về kết quả dưới dạng object JavaScript (không phải JSON string, không có markdown, không có backtick).
		Hãy sử dụng các emoji phù hợp một cách tinh tế để làm cho phần giải nghĩa thêm sinh động và biểu cảm nhé! ✨🔮

		/**
		Thông tin đầu vào:
		{
			question: "${question}", // Sử dụng trimmedQuestion đã được xử lý
			cards: ${JSON.stringify(cards)},
			age: ${age},
			name: ${name},
		}

		Yêu cầu giải nghĩa (nếu câu hỏi có ý nghĩa):
		1. Ngôn ngữ: Tiếng Việt.
		2. Định dạng trả về: object JavaScript với các trường sau:
			{
				meaningCard1: "Giải nghĩa chi tiết lá bài 1, tập trung vào mối liên hệ với câu hỏi '${question}'. Bao gồm vị trí xuôi/ngược. Thêm emoji phù hợp.",
				meaningCard2: "Giải nghĩa chi tiết lá bài 2, tập trung vào mối liên hệ với câu hỏi '${question}'. Bao gồm vị trí xuôi/ngược. Thêm emoji phù hợp.",
				meaningCard3: "Giải nghĩa chi tiết lá bài 3, tập trung vào mối liên hệ với câu hỏi '${question}'. Bao gồm vị trí xuôi/ngược. Thêm emoji phù hợp.",
				meaningCard4: "Giải nghĩa chi tiết lá bài 4, tập trung vào mối liên hệ với câu hỏi '${question}'. Bao gồm vị trí xuôi/ngược. Thêm emoji phù hợp.",
				meaningCard5: "Giải nghĩa chi tiết lá bài 5, tập trung vào mối liên hệ với câu hỏi '${question}'. Bao gồm vị trí xuôi/ngược. Thêm emoji phù hợp.",
				overAll: "Tổng kết thật chi tiết, sâu sắc, liên kết ý nghĩa các lá bài với nhau và trả lời trực tiếp cho câu hỏi '${question}'. Nếu câu hỏi liên quan đến thời gian (ví dụ: 'Bao giờ tôi mua được nhà?'), hãy cố gắng đưa ra một khung thời gian dự kiến nếu các lá bài gợi ý điều đó, giải thích rõ ràng dựa trên ý nghĩa các lá bài. Thêm emoji phù hợp để tăng tính biểu cảm 🎉."
			}
			Nếu ít hơn 5 lá bài, các trường meaningCardX không có thì để rỗng ('') hoặc null.
		3. Phần giải nghĩa từng lá bài và phần tổng kết phải thật chi tiết, dài, sâu sắc, phân tích rõ ý nghĩa, **luôn liên hệ trực tiếp với câu hỏi của người hỏi**.
		4. Chỉ trả về object, không trả về bất kỳ ký tự markdown, backtick, hoặc JSON string nào.
		5. Xử lý đầu vào và trả về kết quả đúng định dạng object như trên.
		6. Phần overAll hãy kết đọc ỹ nghĩa các lá bài khi kếp hợp với nhau thay thì riêng lẻ từng lá và cần lưu ý những điều sau ở phần overAll: 
			6.1 Hãy chú ý đến số lượng lá ẩn chính và ẩn phụ trong bộ bài và từ đó đưa ra những nhận định chính xác về tình huống của người hỏi.
			6.2 Nếu có thể, hãy đưa ra những lời khuyên hoặc hướng dẫn cụ thể cho người hỏi dựa trên ý nghĩa của các lá bài.
			6.3 Nếu câu hỏi mang tính yes/no question hãy căn cứ vào số lượng bà ngược và xuôi để đưa ra câu trả lời cho câu hỏi đó.
			6.4 Cố gắng đưa ra câu trả lời cụ thể và thỏa mãn cho câu hỏi của người hỏi, đặc biệt với các câu hỏi về thời gian hoặc một kết quả cụ thể.
			6.5 Cố gắng chú ý đến suit của các lá bài, nếu có thể hãy đưa ra những nhận định về tình huống của người hỏi dựa trên suit của các lá bài.
			6.6 Đưa ra lời khuyên hoặc hướng dẫn cụ thể cho người hỏi dựa trên ý nghĩa của các lá bài.
		*/`;

		const genAI = new GoogleGenerativeAI(GEMINI_KEY);
		const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
		const result = await model.generateContent(prompt);
		let response = result.response.text();
		// Xử lý response để loại bỏ markdown/backtick và parse thành object
		response = response.replace(/^[`]+[a-zA-Z]*|[`]+$/g, '').trim();
		// Loại bỏ các prefix như 'javascript', 'json', ...
		response = response.replace(/^(javascript|json)\n/, '');

		let obj;
		let successfullyParsedResponse = false;
		try {
			// Nếu là JSON hợp lệ
			obj = JSON.parse(response);
			successfullyParsedResponse = true;
		} catch (e) {
			// Nếu là object JS thuần (không phải JSON), dùng eval
			try {
				obj = eval('(' + response + ')');
				successfullyParsedResponse = true;
			} catch (e2) {
				obj = {
					meaningCard1: '',
					meaningCard2: '',
					meaningCard3: '',
					meaningCard4: '',
					meaningCard5: '',
					overAll:
						'Câu hỏi của bạn không rõ ràng hoặc không có ý nghĩa. Vui lòng đặt một câu hỏi cụ thể bằng tiếng Việt để được giải bài Tarot.',
				};
				// successfullyParsedResponse remains false
			}
		}

		// Add record to tarot db only if Gemini's response was successfully parsed
		if (successfullyParsedResponse) {
			try {
				await tarotAdd({ name, age, question, ip, isDev }); // isDev will use default in model
			} catch (dbError) {
				console.error('Error adding record to tarot db:', dbError);
				// Log the error, but don't let it stop the function from returning obj.
				// Consider how to handle this error more robustly if needed, e.g. using a dedicated logger.
			}
		}

		return obj;
	}

	static async addFeedback({ name, age, content }) {
		return await addTarotFeedback({ name, age, content });
	}
}

module.exports = TarotService;
