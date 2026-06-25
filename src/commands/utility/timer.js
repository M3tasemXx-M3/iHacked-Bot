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
    .setName("timer")
    .setDescription("Advanced timer system (DM notification)")
    .addStringOption((o) =>
      o.setName("time").setDescription("Example: 2h 10m 5s").setRequired(true),
    ),

  async execute(interaction) {
    const timeInput = interaction.options.getString("time");
    const ms = parseTime(timeInput);

    if (!ms || ms < 1000) {
      return interaction.reply({
        content: "❌ Invalid format. Example: `1h 20m 10s`",
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: `⏱ Timer started for **${timeInput}** (DM alert)`,
      ephemeral: true,
    });

    setTimeout(async () => {
      const dm = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle("⏰ TIMER FINISHED")
        .setDescription(`Your timer has ended.`)
        .addFields(
          { name: "⏱ Duration", value: timeInput },
          { name: "📌 Status", value: "Completed" },
        )
        .setFooter({ text: "iHacked-Core Utility System" })
        .setTimestamp();

      try {
        await interaction.user.send({ embeds: [dm] });
      } catch {
        await interaction.followUp({
          content: "⚠️ Cannot send DM.",
          ephemeral: true,
        });
      }
    }, ms);
  },
};
