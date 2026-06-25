const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Show bot statistics"),

  async execute(interaction) {
    const client = interaction.client;

    const guilds = client.guilds.cache.size;
    const users = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    const channels = client.channels.cache.size;

    const embed = {
      color: 0x9b59b6,
      title: "📊 BOT STATISTICS PANEL",
      fields: [
        { name: "🌐 Servers", value: `${guilds}`, inline: true },
        { name: "👥 Users", value: `${users}`, inline: true },
        { name: "💬 Channels", value: `${channels}`, inline: true },
        { name: "📡 Ping", value: `${client.ws.ping}ms`, inline: true },
        { name: "🟢 Status", value: "Online", inline: true },
      ],
      footer: { text: "System Analytics Engine" },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
