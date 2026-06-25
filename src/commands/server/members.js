const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("members")
    .setDescription("Show server member statistics"),

  async execute(interaction) {
    const guild = interaction.guild;

    const total = guild.memberCount;
    const bots = guild.members.cache.filter((m) => m.user.bot).size;
    const humans = total - bots;

    const online = guild.members.cache.filter(
      (m) => m.presence?.status === "online",
    ).size;

    const embed = {
      color: 0x2ecc71,
      title: "👥 MEMBER STATISTICS PANEL",
      fields: [
        { name: "👤 Humans", value: `${humans}`, inline: true },
        { name: "🤖 Bots", value: `${bots}`, inline: true },
        { name: "🟢 Online", value: `${online}`, inline: true },
        { name: "👥 Total", value: `${total}`, inline: true },
      ],
      footer: { text: guild.name },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
