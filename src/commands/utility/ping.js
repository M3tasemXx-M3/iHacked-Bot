const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Display bot latency and API status"),

  async execute(interaction) {
    const ping = interaction.client.ws.ping;

    let status = "🟢 Excellent";
    let color = 0x00ff99;

    if (ping >= 100) {
      status = "🟡 Stable";
      color = 0xf1c40f;
    }

    if (ping >= 200) {
      status = "🔴 High Latency";
      color = 0xe74c3c;
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle("🏓 PING STATUS")
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription(
        `⚡ **Bot Latency Information**

• 🌐 **API Ping:** \`${ping}ms\`
• 📡 **Connection Status:** ${status}
• 🤖 **Client:** ${interaction.client.user.username}

━━━━━━━━━━━━━━━━━━
🟢 Stable Connection Active
━━━━━━━━━━━━━━━━━━`,
      )
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    return interaction.reply({
      embeds: [embed],
    });
  },
};
