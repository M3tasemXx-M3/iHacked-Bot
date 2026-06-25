const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("daily")

    .setDescription("Claim daily reward"),

  async execute(interaction) {
    const result = GameStats.claimDaily(interaction.user.id);

    if (!result) {
      return interaction.reply({
        content: "⏳ You already claimed your daily reward.",

        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()

      .setColor("#22c55e")

      .setTitle("🎁 Daily Reward")

      .setDescription(
        `
💰 +100 Coins

⭐ +50 XP

Come back tomorrow!
`,
      );

    interaction.reply({
      embeds: [embed],
    });
  },
};
