const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("servericon")
    .setDescription("Show server icon"),

  async execute(interaction) {
    const guild = interaction.guild;

    const icon = guild.iconURL({ size: 1024 });

    if (!icon) {
      return interaction.reply({
        content: "❌ Server has no icon.",
        ephemeral: true,
      });
    }

    const embed = {
      color: 0x3498db,
      title: "🖼️ SERVER ICON VIEWER",
      image: { url: icon },
      footer: { text: guild.name },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
