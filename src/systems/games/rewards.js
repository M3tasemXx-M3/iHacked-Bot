const GameStats = require("../../database/models/gameStatsModel");

class Rewards {
  static async reward(userId, coins) {
    await GameStats.addCoins(userId, coins);

    return {
      success: true,
      coins,
    };
  }
}

module.exports = Rewards;
