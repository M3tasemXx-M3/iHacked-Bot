const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("give")

    .setDescription("Send coins")

    .addUserOption((option) =>
      option.setName("user").setRequired(true).setDescription("User"),
    )

    .addIntegerOption((option) =>
      option.setName("amount").setRequired(true).setDescription("Coins"),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");

    const amount = interaction.options.getInteger("amount");

    if (amount <= 0)
      return interaction.reply({
        content: "❌ Invalid amount",
        ephemeral: true,
      });

    const sender = GameStats.get(interaction.user.id);

    if (sender.coins < amount)
      return interaction.reply({
        content: "❌ Not enough coins",
        ephemeral: true,
      });

    GameStats.removeCoins(interaction.user.id, amount);

    GameStats.addCoins(user.id, amount);

    interaction.reply({
      embeds: [
        new EmbedBuilder()

          .setColor("#5865F2")

          .setTitle("💸 Transfer")

          .setDescription(
            `${interaction.user} sent **${amount}** coins to ${user}`,
          ),
      ],
    });
  },
};
