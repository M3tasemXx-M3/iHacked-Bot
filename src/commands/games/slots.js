const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");

const playSlots = require("../../systems/casino/slotsGame");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("slots")

    .setDescription("Play slot machine")

    .addIntegerOption((option) =>
      option.setName("amount").setDescription("Bet amount").setRequired(true),
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

    const result = playSlots(amount);

    if (result.win) {
      GameStats.addCoins(interaction.user.id, result.reward);
    }

    const embed = new EmbedBuilder()

      .setColor(result.win ? "#22c55e" : "#ef4444")

      .setTitle("🎰 Slot Machine")

      .setDescription(
        `# ${result.spin.join(" ")}

${result.win ? `🎉 Won ${result.reward} Coins` : `💸 Lost ${amount} Coins`}`,
      );

    interaction.reply({
      embeds: [embed],
    });
  },
};
