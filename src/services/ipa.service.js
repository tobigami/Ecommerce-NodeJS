'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_KEY } = process.env;
const cheerio = require('cheerio');
const axios = require('axios');

class IpaService {
	static async getCambridgeAudioUrl(word) {
		try {
			// Create axios instance with timeout and retry config
			const instance = axios.create({
				timeout: 5000, // 5 second timeout
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				},
			});

			const url = `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(word)}`;
			const response = await instance.get(url);
			const $ = cheerio.load(response.data);

			// More specific selector for UK pronunciation
			const audioElement = $(
				'.uk.dpron-i source[type="audio/mpeg"], amp-audio[data-location="uk"] source[type="audio/mpeg"]',
			).first();
			const audioUrl = audioElement.attr('src');

			return audioUrl ? `https://dictionary.cambridge.org${audioUrl}` : null;
		} catch (error) {
			console.warn(`Warning: Could not fetch audio for word "${word}":`, error.message);
			return null; // Return null instead of throwing`
		}
	}

	static async getIpa({ ipa }) {
		const quantityWord = 8;
		try {
			const genAI = new GoogleGenerativeAI(GEMINI_KEY);
			const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

			const prompt = `Give me a JSON list of ${quantityWord} English words that contain the UK IPA sound '${ipa}'.
                      The first 4 words in the list should be simple words with only one syllable.
                      The next few words should gradually increase in complexity and number of syllables.
                      Each object in the list should have the following keys and corresponding values:
                      - "word": The English word.
                      - "ipa_uk": The UK phonetic transcription of the word.
                      - "meaning_en": The English meaning of the word.
                      - "meaning_vi": The Vietnamese meaning of the word.
                      - "example": A sentence demonstrating how to use the word in English.
                      Ensure the response is plain JSON without any markdown formatting like backticks.
                      Format: [{"word": "cat", "ipa_uk": "/kæt/", "meaning_en": "a small domesticated carnivorous mammal", "meaning_vi": "con mèo", "example": "The cat sat on the mat."}, ...]`;

			const result = await model.generateContent(prompt);
			const response = result.response.text();
			const words = JSON.parse(response);

			// Add delay between requests to avoid rate limiting
			const wordsWithAudio = await Promise.all(
				words.map(async (word, index) => {
					// Add delay between requests (500ms * index)
					await new Promise((resolve) => setTimeout(resolve, index * 500));

					try {
						const audio_url = await this.getCambridgeAudioUrl(word.word);
						return { ...word, audio_url };
					} catch (error) {
						return { ...word, audio_url: null };
					}
				}),
			);

			return wordsWithAudio;
		} catch (error) {
			console.error('Gemini API error:', error);
			throw new Error('Failed to fetch words from Gemini API');
		}
	}
}

module.exports = IpaService;
