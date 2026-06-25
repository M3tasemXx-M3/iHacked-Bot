const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const db = require("../../database/sqlite");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("leaderboard")

    .setDescription("Richest players"),

  async execute(interaction) {
    const players = db
      .prepare(
        `

      SELECT *

      FROM game_stats

      ORDER BY coins DESC

      LIMIT 10

    `,
      )
      .all();

    const text = players
      .map((user, index) => {
        const medals = ["🥇", "🥈", "🥉"];

        const rank = medals[index] || `#${index + 1}`;

        return `${rank} <@${user.userId}> • 💰 ${user.coins}`;
      })
      .join("\n");

    interaction.reply({
      embeds: [
        new EmbedBuilder()

          .setColor("#facc15")

          .setTitle("💰 Richest Players")

          .setDescription(text),
      ],
    });
  },
};
