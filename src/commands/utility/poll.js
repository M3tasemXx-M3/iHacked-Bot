const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const polls = new Map();
/*
messageId -> {
  question,
  options,
  emojis,
  votes,
  users,
  channelId
}
*/

module.exports = {
  polls,

  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a professional reaction poll system")
    .addStringOption((o) =>
      o.setName("question").setDescription("Poll question").setRequired(true),
    )
    .addIntegerOption((o) =>
      o
        .setName("duration")
        .setDescription("Duration in seconds")
        .setRequired(true),
    )
    .addStringOption((o) =>
      o.setName("option1").setDescription("First option").setRequired(true),
    )
    .addStringOption((o) =>
      o.setName("option2").setDescription("Second option").setRequired(true),
    )
    .addStringOption((o) =>
      o.setName("option3").setDescription("Third option").setRequired(false),
    )
    .addStringOption((o) =>
      o.setName("option4").setDescription("Fourth option").setRequired(false),
    ),

  async execute(interaction) {
    const question = interaction.options.getString("question");
    const duration = interaction.options.getInteger("duration");

    const options = [
      interaction.options.getString("option1"),
      interaction.options.getString("option2"),
      interaction.options.getString("option3"),
      interaction.options.getString("option4"),
    ].filter(Boolean);

    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];

    const votes = Array(options.length).fill(0);
    const users = new Set();

    const embed = new EmbedBuilder()
      .setTitle("📊 Live Poll")
      .setColor("#5865F2")
      .setDescription(
        `**${question}**\n\n` +
          options.map((opt, i) => `${emojis[i]} ${opt}`).join("\n"),
      )
      .setFooter({ text: `Ends in ${duration} seconds` })
      .setTimestamp();

    const msg = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });

    // ➕ add reactions
    for (let i = 0; i < options.length; i++) {
      await msg.react(emojis[i]);
    }

    // save poll
    polls.set(msg.id, {
      question,
      options,
      emojis,
      votes,
      users,
      channelId: msg.channel.id,
    });

    // ⏳ auto close
    setTimeout(async () => {
      const poll = polls.get(msg.id);
      if (!poll) return;

      const channel = await interaction.client.channels.fetch(poll.channelId);
      const message = await channel.messages.fetch(msg.id);

      const results = poll.options.map((opt, i) => ({
        name: `${poll.emojis[i]} ${opt}`,
        value: `🗳️ Votes: ${poll.votes[i]}`,
        inline: false,
      }));

      const resultEmbed = new EmbedBuilder()
        .setTitle("📊 Poll Results")
        .setColor("#ED4245")
        .setDescription(`**${poll.question}**`)
        .addFields(results)
        .setTimestamp();

      await channel.send({
        embeds: [resultEmbed],
      });

      polls.delete(msg.id);
    }, duration * 1000);
  },
};
