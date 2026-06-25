const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Basic user info")
    .addUserOption(
      (o) => o.setName("user").setDescription("Select a user"), // ✔ FIX
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    const embed = {
      color: 0x2f3136,
      title: "👤 SYSTEM USER PROFILE",
      thumbnail: { url: user.displayAvatarURL() },
      fields: [
        { name: "🧾 Username", value: user.tag, inline: true },
        { name: "🆔 ID", value: user.id, inline: true },
        { name: "🤖 Bot", value: user.bot ? "Yes" : "No", inline: true },
        {
          name: "📅 Created",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
        },
      ],
      footer: { text: "User System Module" },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
