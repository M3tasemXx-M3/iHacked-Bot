const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

function parseTime(input) {
  const regex = /(\d+)\s*(s|m|h|d)/gi;

  let match;
  let ms = 0;

  while ((match = regex.exec(input)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    if (unit === "s") ms += value * 1000;
    if (unit === "m") ms += value * 60 * 1000;
    if (unit === "h") ms += value * 60 * 60 * 1000;
    if (unit === "d") ms += value * 24 * 60 * 60 * 1000;
  }

  return ms;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Advanced reminder system (DM)")
    .addStringOption((o) =>
      o.setName("time").setDescription("Example: 1h 20m 10s").setRequired(true),
    )
    .addStringOption((o) =>
      o.setName("message").setDescription("Reminder message").setRequired(true),
    ),

  async execute(interaction) {
    const timeInput = interaction.options.getString("time");
    const message = interaction.options.getString("message");

    const ms = parseTime(timeInput);

    if (!ms || ms < 1000) {
      return interaction.reply({
        content: "❌ Invalid time format. Use like: `1h 20m 10s`",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle("🔔 REMINDER SET")
      .setDescription(`You will be reminded in **${timeInput}**`)
      .addFields({ name: "📝 Message", value: message })
      .setFooter({ text: "iHacked-Core Reminder Engine" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });

    setTimeout(async () => {
      const dm = new EmbedBuilder()
        .setColor(0x00ff88)
        .setTitle("🔔 REMINDER TRIGGERED")
        .setDescription(message)
        .addFields(
          { name: "⏱ Scheduled Time", value: timeInput },
          { name: "📌 Status", value: "Completed" },
        )
        .setFooter({ text: "iHacked-Core Notification System" })
        .setTimestamp();

      try {
        await interaction.user.send({ embeds: [dm] });
      } catch {
        await interaction.followUp({
          content: "⚠️ I couldn't send you a DM.",
          ephemeral: true,
        });
      }
    }, ms);
  },
};
