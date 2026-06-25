const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const db = require("../../database/sqlite");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("crime-top")

    .setDescription("Crime leaderboard"),

  async execute(interaction) {
    const users = db
      .prepare(
        `

      SELECT *

      FROM game_stats

      ORDER BY crimeSuccess DESC

      LIMIT 10

    `,
      )
      .all();

    const text = users
      .map((user, index) => {
        const medals = ["🥇", "🥈", "🥉"];

        return `${medals[index] || `#${index + 1}`} <@${user.userId}> • 🦹 ${user.crimeSuccess}`;
      })
      .join("\n");

    interaction.reply({
      embeds: [
        new EmbedBuilder()

          .setColor("#ef4444")

          .setTitle("🦹 Crime Leaderboard")

          .setDescription(text),
      ],
    });
  },
};
