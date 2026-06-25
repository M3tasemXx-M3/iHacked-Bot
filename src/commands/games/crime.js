const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");

const crimeGame = require("../../systems/casino/crimeGame");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("crime")

    .setDescription("Commit a crime"),

  async execute(interaction) {
    const stats = GameStats.get(interaction.user.id);

    const cooldown = 45 * 60 * 1000;

    const now = Date.now();

    if (now - stats.lastCrime < cooldown) {
      const minutes = Math.ceil((cooldown - (now - stats.lastCrime)) / 60000);

      return interaction.reply({
        content: `⏳ Wait ${minutes} minutes.`,

        ephemeral: true,
      });
    }

    const result = crimeGame();

    GameStats.setLastCrime(interaction.user.id);

    if (result.success) {
      GameStats.addCoins(interaction.user.id, result.coins);

      GameStats.addCrimeSuccess(interaction.user.id);
    } else {
      const fine = Math.min(stats.coins, result.coins);

      GameStats.removeCoins(interaction.user.id, fine);

      GameStats.addCrimeFail(interaction.user.id);
    }

    const embed = new EmbedBuilder()

      .setColor(result.success ? "#22c55e" : "#ef4444")

      .setTitle("🦹 Crime");

    if (result.success) {
      embed.setDescription(
        `${result.crime}

💰 +${result.coins} Coins`,
      );
    } else {
      embed.setDescription(
        `${result.crime}

🚔 You got caught

💸 -${result.coins} Coins`,
      );
    }

    interaction.reply({
      embeds: [embed],
    });
  },
};
