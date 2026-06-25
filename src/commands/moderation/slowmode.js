const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("slowmode")

    .setDescription("Set channel slowmode")

    .addIntegerOption((option) =>
      option
        .setName("seconds")
        .setDescription("Slowmode duration in seconds")
        .setRequired(true),
    )

    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const seconds = interaction.options.getInteger("seconds");

    if (seconds < 0 || seconds > 21600) {
      return interaction.reply({
        content: "❌ Slowmode must be between 0 and 21600 seconds.",
        ephemeral: true,
      });
    }

    await interaction.channel.setRateLimitPerUser(seconds);

    const embed = new EmbedBuilder()

      .setColor(0x3498db)

      .setTitle("🐢 Slowmode Updated")

      .setDescription(
        seconds === 0
          ? "✅ Slowmode disabled."
          : `⏱️ Slowmode set to ${seconds} seconds.`,
      )

      .addFields({
        name: "🛡️ Moderator",
        value: interaction.user.tag,
      })

      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
  },
};
