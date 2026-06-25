const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const db = require("../../database/sqlite");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blackjack-top")
    .setDescription("Blackjack leaderboard"),

  async execute(interaction) {
    const users = db
      .prepare(
        `
      SELECT *
      FROM game_stats
      ORDER BY blackjackWins DESC
      LIMIT 10
    `,
      )
      .all();

    const text = users
      .map((u, i) => {
        const rank = ["🥇", "🥈", "🥉"][i] || `#${i + 1}`;

        return `${rank} <@${u.userId}> • 🃏 ${u.blackjackWins}`;
      })
      .join("\n");

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#5865F2")
          .setTitle("🃏 Blackjack Leaderboard")
          .setDescription(text || "No data"),
      ],
    });
  },
};
