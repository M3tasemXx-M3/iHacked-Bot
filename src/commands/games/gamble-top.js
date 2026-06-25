const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const db = require("../../database/sqlite");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("gamble-top")

    .setDescription("Top gambling players"),

  async execute(interaction) {
    const users = db
      .prepare(
        `

      SELECT *

      FROM game_stats

      ORDER BY gambleProfit DESC

      LIMIT 10

    `,
      )
      .all();

    const text = users
      .map((u, i) => {
        const rank = ["🥇", "🥈", "🥉"][i] || `#${i + 1}`;

        return `${rank} <@${u.userId}> • 💰 ${u.gambleProfit}`;
      })
      .join("\n");

    interaction.reply({
      embeds: [
        new EmbedBuilder()

          .setColor("#22c55e")

          .setTitle("💰 Gambling Leaderboard")

          .setDescription(text || "No data"),
      ],
    });
  },
};
