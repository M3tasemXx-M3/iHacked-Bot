const sessions = require("../../../systems/casino/blackjackSessions");

const GameStats = require("../../../database/models/gameStatsModel");

module.exports = {
  customId: "bj_double",

  async execute(interaction) {
    const session = sessions.get(interaction.user.id);

    if (!session) return;

    const stats = GameStats.get(interaction.user.id);

    if (stats.coins < session.amount) {
      return interaction.reply({
        content: "❌ Not enough coins.",

        ephemeral: true,
      });
    }

    GameStats.removeCoins(interaction.user.id, session.amount);

    session.amount *= 2;

    interaction.reply({
      content: `💰 Bet doubled to ${session.amount}`,

      ephemeral: true,
    });
  },
};
