const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("panel")

    .setDescription("Open control panel")

    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()

      .setColor(0x5865f2)

      .setTitle("🎛️ iHacked-Core Control Panel")

      .setDescription(
        `> Advanced server management system

⚡ Select a category below.`,
      );

    const menu = new StringSelectMenuBuilder()

      .setCustomId("main_panel")

      .setPlaceholder("Select a panel category")

      .addOptions(
        {
          label: "Moderation",
          description: "Ban, Kick, Timeout...",
          value: "moderation",
          emoji: "🔨",
        },
        {
          label: "Channels",
          description: "Clear, Slowmode...",
          value: "channels",
          emoji: "🧹",
        },
        {
          label: "Security",
          description: "Protection systems",
          value: "security",
          emoji: "🛡️",
        },
        {
          label: "Server",
          description: "Server configuration",
          value: "server",
          emoji: "⚙️",
        },
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
