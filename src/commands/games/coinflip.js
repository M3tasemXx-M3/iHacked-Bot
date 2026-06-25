const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("coinflip")

    .setDescription("Bet your coins")

    .addIntegerOption((option) =>
      option.setName("amount").setDescription("Bet").setRequired(true),
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    const stats = GameStats.get(interaction.user.id);

    if (amount <= 0)
      return interaction.reply({
        content: "❌ Invalid bet",
        ephemeral: true,
      });

    if (stats.coins < amount)
      return interaction.reply({
        content: "❌ Not enough coins",
        ephemeral: true,
      });

    const win = Math.random() < 0.5;

    if (win) {
      GameStats.addCoins(interaction.user.id, amount);
    } else {
      GameStats.removeCoins(interaction.user.id, amount);
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()

          .setColor(win ? "#22c55e" : "#ef4444")

          .setTitle("🪙 Coin Flip")

          .setDescription(
            win
              ? `🎉 You won ${amount} coins!`
              : `💸 You lost ${amount} coins!`,
          ),
      ],
    });
  },
};
