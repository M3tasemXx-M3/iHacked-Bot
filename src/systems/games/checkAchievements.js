const Achievement = require("../../database/models/achievementModel");

module.exports = (userId, stats) => {
  const unlocked = [];

  if (stats.mathWins >= 10 && !Achievement.has(userId, "Math Rookie")) {
    Achievement.unlock(userId, "Math Rookie");

    unlocked.push("🧠 Math Rookie");
  }

  if (stats.mathWins >= 100 && !Achievement.has(userId, "Math Master")) {
    Achievement.unlock(userId, "Math Master");

    unlocked.push("⚡ Math Master");
  }

  if (stats.mathWins >= 500 && !Achievement.has(userId, "Einstein")) {
    Achievement.unlock(userId, "Einstein");

    unlocked.push("👑 Einstein");
  }

  return unlocked;
};
