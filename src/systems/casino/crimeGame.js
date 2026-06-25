const crimes = [
  {
    name: "🏦 Bank Heist",
    successCoins: [1000, 2500],
    failCoins: [300, 800],
  },

  {
    name: "🚗 Car Theft",
    successCoins: [500, 1200],
    failCoins: [150, 500],
  },

  {
    name: "💎 Jewelry Robbery",
    successCoins: [800, 1800],
    failCoins: [250, 600],
  },

  {
    name: "🏪 Store Robbery",
    successCoins: [300, 1000],
    failCoins: [100, 400],
  },
];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = () => {
  const crime = crimes[random(0, crimes.length - 1)];

  const success = Math.random() < 0.7;

  if (success) {
    return {
      success: true,

      crime: crime.name,

      coins: random(crime.successCoins[0], crime.successCoins[1]),
    };
  }

  return {
    success: false,

    crime: crime.name,

    coins: random(crime.failCoins[0], crime.failCoins[1]),
  };
};
