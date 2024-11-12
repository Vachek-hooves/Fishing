export const getFishingAdviceForWeather = (weather) => {
    const advice = {
      Clear: {
        tips: [
          "Use sunscreen and stay hydrated",
          "Fish might be deeper in water during bright days",
          "Early morning and late evening are best",
        ]
      },
      Clouds: {
        tips: [
          "Ideal conditions for fishing",
          "Fish might be more active near surface",
          "Try different depths throughout the day",
        ]
      },
      Rain: {
        tips: [
          "Fish are often more active before and after rain",
          "Use brighter lures for better visibility",
          "Focus on areas where rain creates surface disturbance",
        ]
      },
      // ... add more weather conditions
    };
  
    return advice[weather] || {
      tips: ["Check local fishing reports", "Adjust techniques based on conditions"]
    };
  };