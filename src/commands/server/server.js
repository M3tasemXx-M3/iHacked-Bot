const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Show server information"),

  async execute(interaction) {
    const guild = interaction.guild;

    const embed = {
      color: 0x2f3136,
      title: "🌐 SERVER OVERVIEW PANEL",
      thumbnail: { url: guild.iconURL({ dynamic: true }) },
      fields: [
        { name: "🏷️ Name", value: guild.name, inline: true },
        { name: "🆔 ID", value: guild.id, inline: true },
        { name: "👑 Owner", value: `<@${guild.ownerId}>`, inline: true },
        { name: "👥 Members", value: `${guild.memberCount}`, inline: true },
        {
          name: "📅 Created",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
      ],
      footer: { text: "Server System Module" },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
