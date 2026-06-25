const { EmbedBuilder } = require("discord.js");

const blackjack = require("../../../systems/casino/blackjackGame");

const sessions = require("../../../systems/casino/blackjackSessions");

const GameStats = require("../../../database/models/gameStatsModel");

module.exports = {
  customId: "bj_stand",

  async execute(interaction) {
    const session = sessions.get(interaction.user.id);

    if (!session) return;

    while (blackjack.calculate(session.dealerHand) < 17) {
      session.dealerHand.push(blackjack.drawCard());
    }

    const player = blackjack.calculate(session.playerHand);

    const dealer = blackjack.calculate(session.dealerHand);

    let result = "Push";

    let color = "#facc15";

    if (dealer > 21 || player > dealer) {
      result = "WIN";

      color = "#22c55e";

      const reward = session.amount * 2;

      GameStats.addCoins(interaction.user.id, reward);

      GameStats.addXP(interaction.user.id, 25);

      GameStats.addBlackjackWin(interaction.user.id);

      GameStats.addGambleProfit(interaction.user.id, session.amount);
    } else if (dealer > player) {
      result = "LOSE";

      color = "#ef4444";

      GameStats.addBlackjackLoss(interaction.user.id);

      GameStats.addGambleProfit(interaction.user.id, -session.amount);
    } else {
      GameStats.addCoins(interaction.user.id, session.amount);
    }

    sessions.delete(interaction.user.id);

    return interaction.update({
      embeds: [
        new EmbedBuilder()

          .setColor(color)

          .setTitle(`🃏 ${result}`)

          .setDescription(
            `Your Hand:
${session.playerHand.join(" ")}
(${player})

Dealer:
${session.dealerHand.join(" ")}
(${dealer})`,
          ),
      ],

      components: [],
    });
  },
};
