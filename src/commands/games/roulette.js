const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");
const rouletteGame = require("../../systems/casino/rouletteGame");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roulette")
    .setDescription("Play roulette and win coins")

    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("Choose your color")
        .setRequired(true)
        .addChoices(
          { name: "🔴 Red", value: "red" },
          { name: "⚫ Black", value: "black" },
          { name: "🟢 Green", value: "green" },
        ),
    )

    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Bet amount")
        .setRequired(true)
        .setMinValue(1),
    ),

  async execute(interaction) {
    const color = interaction.options.getString("color");

    const amount = interaction.options.getInteger("amount");

    const stats = GameStats.get(interaction.user.id);

    if (!stats) {
      return interaction.reply({
        content: "❌ Profile not found.",
        ephemeral: true,
      });
    }

    if (amount <= 0) {
      return interaction.reply({
        content: "❌ Invalid bet amount.",
        ephemeral: true,
      });
    }

    if (stats.coins < amount) {
      return interaction.reply({
        content: "❌ You don't have enough coins.",
        ephemeral: true,
      });
    }

    GameStats.removeCoins(interaction.user.id, amount);

    const result = rouletteGame(color, amount);

    if (result.win) {
      GameStats.addCoins(interaction.user.id, result.reward);
    }

    const colorEmoji = {
      red: "🔴",
      black: "⚫",
      green: "🟢",
    };

    const embed = new EmbedBuilder()
      .setColor(result.win ? "#22c55e" : "#ef4444")
      .setTitle("🎡 Roulette")
      .addFields(
        {
          name: "🎯 Your Choice",
          value: `${colorEmoji[color]} ${color}`,
          inline: true,
        },
        {
          name: "🎲 Result",
          value: `${colorEmoji[result.result]} ${result.result}`,
          inline: true,
        },
        {
          name: "💰 Bet",
          value: amount.toLocaleString(),
          inline: true,
        },
      )
      .setDescription(
        result.win
          ? `🎉 You won **${result.reward.toLocaleString()} Coins**`
          : `💸 You lost **${amount.toLocaleString()} Coins**`,
      )
      .setTimestamp();

    return interaction.reply({
      embeds: [embed],
    });
  },
};
