const symbols = ["🍒", "🍋", "⭐", "🔥", "💎"];

const multipliers = {
  "🍒": 2,
  "🍋": 3,
  "⭐": 5,
  "🔥": 8,
  "💎": 12,
};

module.exports = (bet) => {
  const spin = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  let win = false;
  let reward = 0;

  if (spin[0] === spin[1] && spin[1] === spin[2]) {
    win = true;

    reward = bet * multipliers[spin[0]];
  }

  return {
    spin,
    win,
    reward,
  };
};
