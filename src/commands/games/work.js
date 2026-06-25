const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");

const jobs = require("../../systems/economy/jobs");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("work")

    .setDescription("Work and earn coins"),

  async execute(interaction) {
    const stats = GameStats.get(interaction.user.id);

    const cooldown = 60 * 60 * 1000;

    const now = Date.now();

    if (now - stats.lastWork < cooldown) {
      const remaining = Math.ceil((cooldown - (now - stats.lastWork)) / 60000);

      return interaction.reply({
        content: `⏳ Come back in ${remaining} minutes.`,

        ephemeral: true,
      });
    }

    const job = jobs[Math.floor(Math.random() * jobs.length)];

    const coins =
      Math.floor(Math.random() * (job.coins[1] - job.coins[0] + 1)) +
      job.coins[0];

    const xp =
      Math.floor(Math.random() * (job.xp[1] - job.xp[0] + 1)) + job.xp[0];

    GameStats.addCoins(interaction.user.id, coins);

    GameStats.addXP(interaction.user.id, xp);

    GameStats.updateWorkCooldown(interaction.user.id);

    const embed = new EmbedBuilder()

      .setColor("#22c55e")

      .setTitle("🔨 Work")

      .setDescription(
        `Job: ${job.name}\n\n` + `💰 +${coins} Coins\n` + `⭐ +${xp} XP`,
      );

    interaction.reply({
      embeds: [embed],
    });
  },
};
