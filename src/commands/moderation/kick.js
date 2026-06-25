const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("kick")

    .setDescription("Kick a member")

    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a member")
        .setRequired(true),
    )

    .addStringOption((option) =>
      option.setName("reason").setDescription("Kick reason"),
    )

    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");

    const reason =
      interaction.options.getString("reason") || "No reason provided";

    if (!member) {
      return interaction.reply({
        content: "❌ Member not found.",
        ephemeral: true,
      });
    }

    if (!member.kickable) {
      return interaction.reply({
        content: "❌ I cannot kick this member.",
        ephemeral: true,
      });
    }

    if (
      interaction.member.roles.highest.position <= member.roles.highest.position
    ) {
      return interaction.reply({
        content: "❌ You cannot kick this member.",
        ephemeral: true,
      });
    }

    await member.kick(reason);

    const embed = new EmbedBuilder()

      .setColor(0xfaa61a)

      .setTitle("👢 Member Kicked")

      .addFields(
        {
          name: "👤 User",
          value: member.user.tag,
          inline: true,
        },
        {
          name: "🛡️ Moderator",
          value: interaction.user.tag,
          inline: true,
        },
        {
          name: "📄 Reason",
          value: reason,
        },
      )

      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
  },
};
