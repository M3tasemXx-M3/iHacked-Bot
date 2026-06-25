const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Show avatar")
    .addUserOption(
      (o) => o.setName("user").setDescription("Select a user"), // ✔️ هذا هو الحل
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    const embed = {
      color: 0x3498db,
      title: "🖼️ AVATAR VIEWER",
      description: `**${user.tag}**`,
      image: { url: user.displayAvatarURL({ size: 1024 }) },
      footer: { text: "Media System" },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
