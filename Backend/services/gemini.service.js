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
      
      // Extract JSON using regex (more robust than startsWith)
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return JSON.parse(text); // Fallback to parsing whole text
    } catch (error) {
      console.error('Gemini JSON Error:', error);
      throw new Error('AI failed to generate valid structured data');
    }
  }
}

module.exports = new GeminiService();
