const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banner")
    .setDescription("Show user banner")
    .addUserOption(
      (o) => o.setName("user").setDescription("Select a user"), // ✔️ مهم جدًا
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    const full = await interaction.client.users.fetch(user.id, {
      force: true,
    });

    const banner = full.bannerURL({ size: 1024 });

    if (!banner) {
      return interaction.reply({
        content: "❌ No banner available.",
        ephemeral: true,
      });
    }

    const embed = {
      color: 0x9b59b6,
      title: "🎨 PREMIUM BANNER VIEW",
      image: { url: banner },
      footer: { text: user.tag },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
