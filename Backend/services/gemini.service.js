const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateContent(prompt) {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('AI generation failed');
    }
  }

  async generateJSON(prompt) {
    try {
      const result = await this.model.generateContent(prompt + "\n\nIMPORTANT: Return ONLY a valid JSON object. No markdown, no triple backticks, no explanatory text.");
      const response = await result.response;
      let text = response.text().trim();
      
      // Clean up markdown code blocks if AI ignored instructions
      if (text.startsWith('```json')) {
        text = text.replace(/```json\n?/, '').replace(/\n?```/, '');
      } else if (text.startsWith('```')) {
        text = text.replace(/```\n?/, '').replace(/\n?```/, '');
      }
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini JSON Error:', error);
      throw new Error('AI failed to generate valid structured data');
    }
  }
}

module.exports = new GeminiService();
