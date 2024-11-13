
const getBestFishingTimes = (moonPhase) => {
  // Returns best fishing time ranges based on moon phase
  const timeRanges = {
    NEW_MOON: ["Dawn (30min before sunrise)", "Dusk (30min after sunset)"],
    FULL_MOON: ["Midnight to 2AM", "Noon to 2PM"],
    // ...  more phases
  };

  return timeRanges[moonPhase] || ["Early morning", "Late evening"];
};

export const getFishingRating = (moonPhase, weather) => {
    // Moon phase fishing ratings (0-10 scale)
    const moonRatings = {
      NEW_MOON: 8, // Excellent for fishing
      WAXING_CRESCENT: 7,
      FIRST_QUARTER: 6,
      WAXING_GIBBOUS: 5,
      FULL_MOON: 9, // Best time for fishing
      WANING_GIBBOUS: 5,
      LAST_QUARTER: 6,
      WANING_CRESCENT: 7,
    };
  
    // Weather condition ratings (0-10 scale)
    const weatherRatings = {
      Clear: 8,
      Clouds: 7,
      Rain: 4,
      Thunderstorm: 2,
      Snow: 3,
      Mist: 6,
      Fog: 5,
    };
  
    const getMoonPhaseCategory = (phase) => {
      if (phase < 0.03) return 'NEW_MOON';
      if (phase < 0.25) return 'WAXING_CRESCENT';
      if (phase < 0.28) return 'FIRST_QUARTER';
      if (phase < 0.47) return 'WAXING_GIBBOUS';
      if (phase < 0.53) return 'FULL_MOON';
      if (phase < 0.72) return 'WANING_GIBBOUS';
      if (phase < 0.78) return 'LAST_QUARTER';
      if (phase < 0.97) return 'WANING_CRESCENT';
      return 'NEW_MOON';
    };
  
    const moonCategory = getMoonPhaseCategory(moonPhase);
    const moonScore = moonRatings[moonCategory] || 5;
    const weatherScore = weatherRatings[weather] || 5;
  
    // Calculate overall rating
    const overallRating = (moonScore + weatherScore) / 2;
  
    return {
      rating: Math.round(overallRating),
      moonPhaseAdvice: getFishingAdviceForMoonPhase(moonCategory),
      weatherAdvice: getFishingAdviceForWeather(weather),
      bestTimeRanges: getBestFishingTimes(moonCategory),
    };
  };

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

  export const getFishingAdviceForMoonPhase = (moonPhase) => {
    const advice = {
      NEW_MOON: {
        general: "Excellent fishing period! Fish are more active during the new moon.",
        tips: [
          "Fish tend to feed more during this time",
          "Best results during dawn and dusk",
          "Use dark-colored lures",
        ]
      },
      FULL_MOON: {
        general: "Peak fishing time! Fish activity is at its highest.",
        tips: [
          "Fish are likely to feed throughout the night",
          "Use light-colored or reflective lures",
          "Focus on shallow waters",
        ]
      },
      FIRST_QUARTER: {
        general: "Good fishing conditions, especially during moonrise.",
        tips: [
          "Focus on the hours around moonrise",
          "Try both surface and deep water fishing",
          "Moderate lure colors work best",
        ]
      },
      // ... add more phases
    };
  
    return advice[moonPhase] || {
      general: "Moderate fishing conditions.",
      tips: ["Try different depths", "Experiment with lure colors", "Focus on known fishing spots"]
    };
  };