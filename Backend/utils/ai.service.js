const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;
    this.baseUrl = process.env.GEMINI_API_KEY 
      ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
      : 'https://openrouter.ai/api/v1/chat/completions';
  }

  async generateTripRecommendation(budget, days, tripType, interests) {
    const prompt = `Generate a travel recommendation for a ${days}-day ${tripType} trip with a budget of ${budget} INR. 
    Interests: ${interests.join(', ')}.
    Return a valid JSON object with the following structure:
    {
      "suggestedCities": [{"name": "", "country": "", "reason": ""}],
      "itinerarySummary": "",
      "estimatedBudgetBreakdown": {"accommodation": 0, "food": 0, "activities": 0},
      "bestActivities": [],
      "travelTips": []
    }`;

    return await this._callAI(prompt);
  }

  async generateFullTripData(destination, duration, budget, tripType, interests) {
    const prompt = `Create a detailed day-by-day travel itinerary for a ${duration}-day ${tripType || 'leisure'} trip to ${destination}.
    Budget: ${budget || 'moderate'} INR.
    Interests: ${(interests || []).join(', ')}.
    
    The response must be a valid JSON object exactly matching this structure:
    {
      "title": "A catchy title for the trip",
      "description": "A brief overview of the trip experience",
      "estimatedBudget": ${budget || 50000},
      "itinerarySections": [
        {
          "title": "Day 1: Arrival and Exploration",
          "description": "What to expect on this day",
          "sectionOrder": 0,
          "activities": [
            {
              "title": "Activity Name",
              "description": "Brief description of the activity",
              "category": "ADVENTURE|FOOD|CULTURE|NIGHTLIFE|NATURE|RELAXATION",
              "location": "Specific location or address",
              "price": 0
            }
          ]
        }
      ]
    }
    
    Ensure categories are exactly one of: ADVENTURE, FOOD, CULTURE, NIGHTLIFE, NATURE, RELAXATION.
    Return ONLY the JSON object.`;

    return await this._callAI(prompt);
  }

  async suggestActivities(city, interests) {
    const prompt = `Suggest the top 5 activities in ${city} for someone interested in ${interests.join(', ')}.
    Return a valid JSON array of objects: [{"title": "", "description": "", "category": ""}]`;

    return await this._callAI(prompt);
  }

  async findHiddenGems() {
    const prompt = `Suggest 5 hidden gem travel destinations globally that are unique and less crowded.
    Return a valid JSON array of objects: [{"name": "", "country": "", "description": "", "whyItsAGem": ""}]`;

    return await this._callAI(prompt);
  }

  async _callAI(prompt) {
    if (!this.apiKey || this.apiKey.includes('your_')) {
      console.warn('AI API Key is missing or not configured.');
      return null;
    }

    try {
      let response;
      let text;

      if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your_')) {
        response = await axios.post(`${this.baseUrl}?key=${this.apiKey}`, {
          contents: [{ parts: [{ text: prompt }] }]
        });
        text = response.data.candidates[0].content.parts[0].text;
      } else {
        response = await axios.post(this.baseUrl, {
          model: 'google/gemini-2.0-flash-001',
          messages: [{ role: 'user', content: prompt }]
        }, {
          headers: { Authorization: `Bearer ${this.apiKey}` }
        });
        text = response.data.choices[0].message.content;
      }

      // Basic JSON extraction if AI wraps it in markdown blocks
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('Failed to parse AI JSON:', e.message);
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('AI Service Error:', error.response?.data || error.message);
      return null;
    }
  }
}

module.exports = new AIService();
