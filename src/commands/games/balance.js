const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const formatNumber = require("../../utils/formatNumber");

const GameStats = require("../../database/models/gameStatsModel");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("balance")

    .setDescription("View your coins balance")

    .addUserOption((option) =>
      option.setName("user").setDescription("Target user").setRequired(false),
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user") || interaction.user;

    const stats = GameStats.get(target.id);

    const embed = new EmbedBuilder()

      .setColor("#facc15")

      .setTitle("💰 Balance")

      .setThumbnail(
        target.displayAvatarURL({
          size: 512,
        }),
      )

      .setDescription(
        `### ${target.username}\n\n` +
          `💰 **Coins:** ${stats.coins.toLocaleString()}\n` +
          `⭐ **Level:** ${stats.level}\n` +
          `📈 **XP:** ${stats.xp}`,
      )

      .setFooter({
        text: "iHacked-Core Economy",
      })

      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
    formatNumber(stats.coins);
  },
};
