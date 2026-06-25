const pollCommand = require("../../commands/utility/poll");

module.exports = {
  customId: "poll",

  async execute(interaction) {
    const [_, action, id] = interaction.customId.split("_");

    const poll = pollCommand.polls.get(id);
    if (!poll) {
      return interaction.reply({
        content: "❌ Poll expired.",
        ephemeral: true,
      });
    }

    const userId = interaction.user.id;

    // إزالة التصويت القديم
    poll.yes.delete(userId);
    poll.no.delete(userId);
    poll.neutral.delete(userId);

    // تسجيل التصويت الجديد
    if (action === "yes") poll.yes.add(userId);
    if (action === "no") poll.no.add(userId);
    if (action === "neutral") poll.neutral.add(userId);

    // إغلاق
    if (action === "close") {
      if (interaction.user.id !== poll.owner) {
        return interaction.reply({
          content: "❌ Only owner can close this poll.",
          ephemeral: true,
        });
      }

      polls.delete(id);

      return interaction.update({
        content: "📊 Poll closed.",
        components: [],
      });
    }

    // تحديث النتائج
    const embed = {
      color: 0xf1c40f,
      title: "📊 ADVANCED POLL SYSTEM",
      description: `**${poll.question}**`,
      fields: [
        { name: "👍 Yes", value: `${poll.yes.size}`, inline: true },
        { name: "👎 No", value: `${poll.no.size}`, inline: true },
        { name: "🤷 Neutral", value: `${poll.neutral.size}`, inline: true },
      ],
      footer: { text: `Poll ID: ${id}` },
      timestamp: new Date(),
    };

    return interaction.update({ embeds: [embed] });
  },
};
