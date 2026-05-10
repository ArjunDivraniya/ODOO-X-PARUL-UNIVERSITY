class PromptService {
  getDetailedTripPlanPrompt(data) {
    return `Create a high-quality, realistic day-by-day travel itinerary for a ${data.duration}-day ${data.tripType || 'leisure'} trip to ${data.destination}.
    Budget: ${data.budget || 'moderate'} INR.
    Interests: ${(data.interests || []).join(', ')}.
    
    The response must be a valid JSON object exactly matching this structure:
    {
      "title": "A catchy and professional title for the trip",
      "description": "A compelling overview of what the traveler will experience",
      "estimatedBudget": ${data.budget || 50000},
      "itinerarySections": [
        {
          "title": "Day 1: [Focus of the day]",
          "description": "Detailed summary of this day's plan",
          "sectionOrder": 0,
          "activities": [
            {
              "title": "Specific Activity Name",
              "description": "Engaging description of the activity",
              "category": "ADVENTURE|FOOD|CULTURE|NIGHTLIFE|NATURE|RELAXATION",
              "location": "Specific location or address in the city",
              "price": 0
            }
          ]
        }
      ]
    }
    
    Rules:
    1. Categories MUST be one of: ADVENTURE, FOOD, CULTURE, NIGHTLIFE, NATURE, RELAXATION.
    2. Provide at least 3 distinct activities per day.
    3. Ensure the title is unique and descriptive.
    4. Return ONLY the JSON object. No markdown blocks.`;
  }

  getActivitySuggestionPrompt(data) {
    return `Suggest 5-8 activities in ${data.city} for a ${data.tripType} trip focusing on ${data.interests.join(', ')}.
    Available Budget for activities: ${data.budget} INR.
    
    Structure the response as a JSON object with:
    {
      "activities": [{ "title": "", "description": "", "category": "", "cost": 0, "rating": 0 }],
      "tips": [""],
      "estimatedCost": 0
    }`;
  }

  getBudgetOptimizationPrompt(data) {
    return `Optimize a ${data.budget} INR budget for a ${data.days}-day trip to ${data.destination} with a ${data.travelStyle} style.
    
    Structure the response as a JSON object with:
    {
      "optimizedBudget": { "accommodation": 0, "food": 0, "transport": 0, "activities": 0, "other": 0 },
      "savingTips": [""],
      "recommendedChanges": [""]
    }`;
  }

  getPackingPrompt(data) {
    return `Suggest a packing checklist for a ${data.days}-day ${data.tripType} trip to ${data.destination}. 
    Current weather condition: ${data.weather}.
    
    Structure the response as a JSON object with:
    {
      "packingItems": [{ "title": "", "category": "", "priority": "HIGH/MEDIUM/LOW" }],
      "essentialItems": [""],
      "weatherTips": [""]
    }`;
  }

  getHiddenGemsPrompt(data) {
    return `Suggest 5 hidden gems (less crowded, unique places) in ${data.city} based on preferences: ${data.preferences.join(', ')}.
    
    Structure the response as a JSON object with:
    {
      "hiddenGems": [{ "name": "", "description": "", "location": "", "whyVisit": "" }],
      "localTips": [""],
      "lessCrowdedPlaces": [""]
    }`;
  }

  getWeatherPlannerPrompt(data) {
    return `Provide travel planning advice for ${data.destination} around ${data.travelDate || 'the current season'} for ${data.days} days.
    
    Structure the response as a JSON object with:
    {
      "weatherSummary": { "temperature": "", "condition": "", "riskLevel": "" },
      "travelAdvice": [""],
      "recommendedActivities": [""],
      "packingSuggestions": [""]
    }`;
  }

  getChatPrompt(message, context = {}) {
    let prompt = `You are a helpful travel assistant for Traveloop. `;
    if (context.tripId) prompt += `Context: The user is planning a trip (ID: ${context.tripId}). `;
    prompt += `User Message: ${message}.
    
    Structure the response as a JSON object with:
    {
      "reply": "your direct answer",
      "suggestions": ["follow up questions or related actions"],
      "relatedCities": ["city names if relevant"],
      "activities": ["activity names if relevant"]
    }`;
    return prompt;
  }
}

module.exports = new PromptService();
