const { EmbedBuilder } = require("discord.js");

module.exports = {
  customId: "main_panel",

  async execute(interaction) {
    const value = interaction.values[0];

    if (value === "moderation") {
      const embed = new EmbedBuilder()

        .setColor(0xed4245)

        .setTitle("🔨 Moderation Panel")

        .setDescription(
          `Available Commands:

• /ban
• /kick
• /timeout
• /clear
• /slowmode`,
        );

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    if (value === "channels") {
      return interaction.reply({
        content: "🧹 Channel tools coming soon.",
        ephemeral: true,
      });
    }

    if (value === "security") {
      return interaction.reply({
        content: "🛡️ Security systems coming soon.",
        ephemeral: true,
      });
    }

    if (value === "server") {
      return interaction.reply({
        content: "⚙️ Server configuration coming soon.",
        ephemeral: true,
      });
    }
  },
};
