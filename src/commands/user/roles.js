const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Show user roles")
    .addUserOption(
      (o) => o.setName("user").setDescription("Select a user"), // ✔ FIX
    ),

  async execute(interaction) {
    const member = interaction.options.getMember("user") || interaction.member;

    const roles =
      member.roles.cache
        .filter((r) => r.id !== interaction.guild.id)
        .map((r) => `🔹 ${r.name}`)
        .join("\n") || "No roles";

    const embed = {
      color: 0xf1c40f,
      title: "🎭 ROLE LIST PANEL",
      description: roles,
      footer: { text: member.user.tag },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
