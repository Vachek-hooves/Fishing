import { getFishingAdviceForMoonPhase,getFishingAdviceForWeather } from "./adviceMoonPhase";

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
  