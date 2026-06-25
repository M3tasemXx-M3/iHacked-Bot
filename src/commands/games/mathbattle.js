const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");

const generateMath = require("../../systems/games/mathGenerator");

const streakRewards = require("../../systems/games/streakRewards");

const checkAchievements = require("../../systems/games/checkAchievements");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mathbattle")
    .setDescription("Math competition")

    .addStringOption((option) =>
      option
        .setName("difficulty")
        .setDescription("Choose difficulty")
        .setRequired(true)

        .addChoices(
          { name: "Easy", value: "easy" },
          { name: "Medium", value: "medium" },
          { name: "Hard", value: "hard" },
          { name: "Extreme", value: "extreme" },
        ),
    ),

  async execute(interaction) {
    const difficulty = interaction.options.getString("difficulty");

    const rewards = {
      easy: {
        coins: 10,
        xp: 5,
      },

      medium: {
        coins: 20,
        xp: 10,
      },

      hard: {
        coins: 35,
        xp: 20,
      },

      extreme: {
        coins: 50,
        xp: 35,
      },
    };

    const challenge = generateMath(difficulty);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()

          .setColor("#5865F2")

          .setTitle("🧮 Math Battle")

          .setDescription(
            `Difficulty: **${difficulty}**\n\n` +
              `Solve:\n\n` +
              `# ${challenge.question}\n\n` +
              `⏳ 120 seconds`,
          ),
      ],
    });

    let winner = false;

    const collector = interaction.channel.createMessageCollector({
      time: 120000,
    });

    collector.on("collect", async (message) => {
      if (message.author.bot || winner) return;

      if (Number(message.content) !== challenge.answer) return;

      winner = true;

      collector.stop();

      GameStats.addCoins(message.author.id, rewards[difficulty].coins);

      GameStats.addXP(message.author.id, rewards[difficulty].xp);

      GameStats.addWin(message.author.id);

      GameStats.addMathWin(message.author.id);

      GameStats.incrementStreak(message.author.id);

      const stats = GameStats.get(message.author.id);

      let bonus = 0;

      if (streakRewards[stats.streak]) {
        bonus = streakRewards[stats.streak];

        GameStats.addCoins(message.author.id, bonus);
      }

      const achievements = checkAchievements(message.author.id, stats);

      let description =
        `🏆 ${message.author}\n\n` +
        `💰 +${rewards[difficulty].coins} Coins\n` +
        `⭐ +${rewards[difficulty].xp} XP\n\n` +
        `🔥 Streak x${stats.streak}`;

      if (bonus > 0) {
        description += `\n🎁 Bonus +${bonus} Coins`;
      }

      if (achievements.length) {
        description += "\n\n🏅 New Achievements:\n" + achievements.join("\n");
      }

      await interaction.followUp({
        embeds: [
          new EmbedBuilder()

            .setColor("#57F287")

            .setTitle("Winner")

            .setDescription(description),
        ],
      });
    });

    collector.on("end", async () => {
      if (winner) return;

      await interaction.followUp({
        embeds: [
          new EmbedBuilder()

            .setColor("#ED4245")

            .setTitle("⏰ Time Up")

            .setDescription(`Correct answer: **${challenge.answer}**`),
        ],
      });
    });
  },
};
