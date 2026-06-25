const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("ban")

    .setDescription("Ban a member")

    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true),
    )

    .addStringOption((option) =>
      option.setName("reason").setDescription("Ban reason"),
    )

    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

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

    if (!member.bannable) {
      return interaction.reply({
        content: "❌ I cannot ban this member.",
        ephemeral: true,
      });
    }

    if (
      interaction.member.roles.highest.position <= member.roles.highest.position
    ) {
      return interaction.reply({
        content: "❌ You cannot ban this member.",
        ephemeral: true,
      });
    }

    await member.ban({
      reason,
    });

    const embed = new EmbedBuilder()

      .setColor(0xed4245)

      .setTitle("🔨 Member Banned")

      .addFields(
        {
          name: "👤 User",
          value: `${member.user.tag}`,
          inline: true,
        },
        {
          name: "🛡️ Moderator",
          value: `${interaction.user.tag}`,
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
