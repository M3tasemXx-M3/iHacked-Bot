const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channels")
    .setDescription("Show channel statistics"),

  async execute(interaction) {
    const guild = interaction.guild;

    const text = guild.channels.cache.filter((c) => c.type === 0).size;
    const voice = guild.channels.cache.filter((c) => c.type === 2).size;
    const category = guild.channels.cache.filter((c) => c.type === 4).size;

    const embed = {
      color: 0x00c2ff,
      title: "📊 CHANNEL ANALYTICS PANEL",
      fields: [
        { name: "💬 Text Channels", value: `${text}`, inline: true },
        { name: "🔊 Voice Channels", value: `${voice}`, inline: true },
        { name: "📁 Categories", value: `${category}`, inline: true },
      ],
      footer: { text: guild.name },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
