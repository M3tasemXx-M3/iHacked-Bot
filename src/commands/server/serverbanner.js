const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverbanner")
    .setDescription("Show server banner"),

  async execute(interaction) {
    const guild = interaction.guild;

    await guild.fetch(); // مهم للحصول على banner

    const banner = guild.bannerURL({ size: 1024 });

    if (!banner) {
      return interaction.reply({
        content: "❌ This server has no banner.",
        ephemeral: true,
      });
    }

    const embed = {
      color: 0x9b59b6,
      title: "🎨 SERVER PREMIUM BANNER",
      image: { url: banner },
      footer: { text: guild.name },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
