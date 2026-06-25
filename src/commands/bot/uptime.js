const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Show bot uptime"),

  async execute(interaction) {
    const seconds = process.uptime();

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds / 3600) % 24;
    const minutes = Math.floor(seconds / 60) % 60;

    const embed = {
      color: 0x3498db,
      title: "⏱ SYSTEM UPTIME",
      fields: [
        { name: "📅 Days", value: `${days}`, inline: true },
        { name: "⏰ Hours", value: `${hours}`, inline: true },
        { name: "⏱ Minutes", value: `${minutes}`, inline: true },
      ],
      footer: { text: "Runtime Monitor" },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
