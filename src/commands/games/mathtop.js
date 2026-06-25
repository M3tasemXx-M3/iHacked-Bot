const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("math-top")
    .setDescription("Top math players"),

  async execute(interaction) {
    const players = GameStats.getTopMath(10);

    if (!players.length) {
      return interaction.reply({
        content: "No players found.",
      });
    }

    const text = players
      .map((player, index) => {
        const medals = ["🥇", "🥈", "🥉"];

        const place = medals[index] || `#${index + 1}`;

        return `${place} <@${player.userId}> • ${player.mathWins} wins`;
      })
      .join("\n");

    const embed = new EmbedBuilder()

      .setColor("#57F287")

      .setTitle("🧠 Math Leaderboard")

      .setDescription(text);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
