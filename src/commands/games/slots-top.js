const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const db = require("../../database/sqlite");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("slots-top")

    .setDescription("Slots leaderboard"),

  async execute(interaction) {
    const users = db
      .prepare(
        `
      SELECT *
      FROM game_stats
      ORDER BY slotsWins DESC
      LIMIT 10
    `,
      )
      .all();

    const text = users
      .map((u, i) => {
        const rank = ["🥇", "🥈", "🥉"][i] || `#${i + 1}`;

        return `${rank} <@${u.userId}> • 🎰 ${u.slotsWins}`;
      })
      .join("\n");

    interaction.reply({
      embeds: [
        new EmbedBuilder()

          .setColor("#facc15")

          .setTitle("🎰 Slots Leaderboard")

          .setDescription(text || "No data"),
      ],
    });
  },
};
