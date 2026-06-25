const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roleslist")
    .setDescription("Show server roles list"),

  async execute(interaction) {
    const roles = interaction.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((r) => `🔹 ${r.name}`)
      .slice(0, 20)
      .join("\n");

    const embed = {
      color: 0xf1c40f,
      title: "🎭 SERVER ROLE HIERARCHY",
      description: roles || "No roles",
      footer: { text: interaction.guild.name },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
