const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("deposit")

    .setDescription("Deposit coins into bank")

    .addIntegerOption((option) =>
      option

        .setName("amount")

        .setDescription("Amount")

        .setRequired(true),
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    const stats = GameStats.get(interaction.user.id);

    if (amount <= 0)
      return interaction.reply({
        content: "❌ Invalid amount",
        ephemeral: true,
      });

    if (stats.coins < amount)
      return interaction.reply({
        content: "❌ Not enough coins",
        ephemeral: true,
      });

    GameStats.removeCoins(interaction.user.id, amount);

    GameStats.addBank(interaction.user.id, amount);

    interaction.reply({
      embeds: [
        new EmbedBuilder()

          .setColor("#22c55e")

          .setTitle("🏦 Deposit")

          .setDescription(`Deposited **${amount}** coins`),
      ],
    });
  },
};
