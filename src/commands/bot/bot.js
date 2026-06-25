const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot")
    .setDescription("Show bot core information"),

  async execute(interaction) {
    const client = interaction.client;

    const uptime = process.uptime();

    const embed = {
      color: 0x2f3136,
      title: "🤖 BOT CORE DASHBOARD",
      thumbnail: { url: client.user.displayAvatarURL() },
      fields: [
        { name: "📛 Name", value: client.user.username, inline: true },
        { name: "🆔 ID", value: client.user.id, inline: true },
        { name: "📡 Ping", value: `${client.ws.ping}ms`, inline: true },
        {
          name: "⏱ Uptime",
          value: `${Math.floor(uptime / 60)} min`,
          inline: true,
        },
        { name: "📦 Node", value: process.version, inline: true },
      ],
      footer: { text: "iHacked-Core System" },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
