const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("clear")

    .setDescription("Delete messages")

    .addIntegerOption((option) =>
      option.setName("amount").setDescription("1 - 100").setRequired(true),
    )

    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: "❌ Amount must be between 1 and 100.",
        ephemeral: true,
      });
    }

    await interaction.channel.bulkDelete(amount, true);

    const embed = new EmbedBuilder()

      .setColor(0x5865f2)

      .setTitle("🧹 Messages Cleared")

      .setDescription(`Deleted ${amount} messages.`)

      .setFooter({
        text: `Moderator: ${interaction.user.tag}`,
      })

      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
