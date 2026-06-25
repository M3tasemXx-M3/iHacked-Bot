const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Advanced user info")
    .addUserOption(
      (o) => o.setName("user").setDescription("Select a user"), // ✔ FIX
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    const member = await interaction.guild.members.fetch(user.id);

    const roles =
      member.roles.cache
        .filter((r) => r.id !== interaction.guild.id)
        .map((r) => `• ${r.name}`)
        .slice(0, 8)
        .join("\n") || "No roles";

    const embed = {
      color: 0x2ecc71,
      title: "📊 ADVANCED USER CONTROL PANEL",
      thumbnail: { url: user.displayAvatarURL() },
      fields: [
        {
          name: "👤 Identity",
          value: `${user.tag}\n\`${user.id}\``,
        },
        {
          name: "📅 Created",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
        },
        {
          name: "🎭 Roles",
          value: roles,
        },
        {
          name: "🤖 Bot",
          value: user.bot ? "Yes" : "No",
          inline: true,
        },
      ],
      footer: { text: "iHacked-Core • User Intelligence Module" },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
