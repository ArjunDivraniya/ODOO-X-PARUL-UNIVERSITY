class PromptService {
  getTripGenerationPrompt(data) {
    return `Generate a comprehensive travel itinerary for a ${data.days}-day trip to ${data.destination}.
    Trip Type: ${data.tripType}
    Interests: ${data.interests.join(', ')}
    Budget: ${data.budget} INR
    Travelers: ${data.travelersCount}
    
    Structure the response as a JSON object with:
    {
      "tripPlan": { "title": "", "summary": "" },
      "itinerary": [
        { "day": 1, "title": "", "activities": [{ "time": "", "title": "", "description": "", "cost": 0 }] }
      ],
      "estimatedBudget": 0,
      "travelTips": [""]
    }`;
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
