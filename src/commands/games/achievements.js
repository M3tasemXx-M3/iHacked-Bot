const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");

const formatNumber = require("../../utils/formatNumber");

const achievements = require("../../systems/games/achievements.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("achievements")
    .setDescription("View your achievements"),

  async execute(interaction) {
    const stats = GameStats.get(interaction.user.id);

    const list = achievements.map((a) => {
      const unlocked = stats.mathWins >= a.required;

      return `${unlocked ? "✅" : "❌"} ${a.name}\n${a.description}`;
    });

    const embed = new EmbedBuilder()

      .setColor("#FEE75C")

      .setTitle("🏅 Achievements")

      .setDescription(list.join("\n\n"));

    await interaction.reply({
      embeds: [embed],
    });
    formatNumber(stats.coins);
  },
};
