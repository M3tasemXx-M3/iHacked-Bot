const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");
const phrases = require("../../systems/games/fastTypeData");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("type")
    .setDescription("Fast typing challenge"),

  async execute(interaction) {
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    const embed = new EmbedBuilder()
      .setTitle("⌨️ Fast Type Challenge")
      .setDescription(
        `Type the following sentence exactly:\n\n\`${phrase}\`\n\n⏳ Time: 30 seconds`,
      )
      .setColor("#5865F2");

    await interaction.reply({
      embeds: [embed],
    });

    const collector = interaction.channel.createMessageCollector({
      time: 30000,
    });

    let winnerFound = false;

    collector.on("collect", async (message) => {
      if (message.author.bot) return;
      if (winnerFound) return;

      if (message.content === phrase) {
        winnerFound = true;

        collector.stop();

        GameStats.addCoins(message.author.id, 25);

        GameStats.addXP(message.author.id, 15);

        GameStats.addWin(message.author.id);

        const stats = GameStats.get(message.author.id);

        await interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setColor("#57F287")
              .setTitle("🏆 Winner!")
              .setDescription(
                `${message.author} typed the phrase first!\n\n💰 +25 Coins\n⭐ +15 XP\n🏆 Total Wins: ${stats.wins}`,
              ),
          ],
        });
      }
    });

    collector.on("end", async () => {
      if (!winnerFound) {
        await interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setColor("#ED4245")
              .setTitle("⏰ Time's Up")
              .setDescription(
                `Nobody typed the sentence in time.\n\nCorrect phrase:\n\`${phrase}\``,
              ),
          ],
        });
      }
    });
  },
};
