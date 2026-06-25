const { EmbedBuilder } = require("discord.js");

const blackjack = require("../../../systems/casino/blackjackGame");

const sessions = require("../../../systems/casino/blackjackSessions");

const GameStats = require("../../../database/models/gameStatsModel");

module.exports = {
  customId: "bj_hit",

  async execute(interaction) {
    const session = sessions.get(interaction.user.id);

    if (!session)
      return interaction.reply({
        content: "❌ No active game.",
        ephemeral: true,
      });

    session.playerHand.push(blackjack.drawCard());

    const total = blackjack.calculate(session.playerHand);

    if (total > 21) {
      GameStats.addBlackjackLoss(interaction.user.id);

      sessions.delete(interaction.user.id);

      return interaction.update({
        embeds: [
          new EmbedBuilder()

            .setColor("#ef4444")

            .setTitle("💥 Bust!")

            .setDescription(
              `${session.playerHand.join(" ")}

Total: ${total}`,
            ),
        ],

        components: [],
      });
    }

    return interaction.update({
      embeds: [
        new EmbedBuilder()

          .setColor("#5865F2")

          .setTitle("🃏 Blackjack")

          .setDescription(
            `Your Hand

${session.playerHand.join(" ")}

Total: ${total}

Dealer:
${session.dealerHand[0]} ❓`,
          ),
      ],
    });
  },
};
