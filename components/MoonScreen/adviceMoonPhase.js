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