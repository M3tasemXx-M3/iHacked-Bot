const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("withdraw")

    .setDescription("Withdraw coins")

    .addIntegerOption((option) =>
      option

        .setName("amount")

        .setRequired(true)

        .setDescription("Amount"),
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    const stats = GameStats.get(interaction.user.id);

    if (stats.bank < amount)
      return interaction.reply({
        content: "❌ Not enough bank balance",

        ephemeral: true,
      });

    GameStats.removeBank(interaction.user.id, amount);

    GameStats.addCoins(interaction.user.id, amount);

    interaction.reply({
      embeds: [
        new EmbedBuilder()

          .setColor("#5865F2")

          .setTitle("💸 Withdraw")

          .setDescription(`Withdrew **${amount}** coins`),
      ],
    });
  },
};
