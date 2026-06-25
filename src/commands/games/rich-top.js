const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const db = require("../../database/sqlite");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("rich-top")

    .setDescription("Richest players leaderboard"),

  async execute(interaction) {
    const users = db
      .prepare(
        `

      SELECT *

      FROM game_stats

      ORDER BY coins DESC

      LIMIT 10

    `,
      )
      .all();

    const text = users
      .map((user, index) => {
        const medals = ["🥇", "🥈", "🥉"];

        return `${medals[index] || `#${index + 1}`} <@${user.userId}> • 💰 ${user.coins}`;
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
