const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("timeout")

    .setDescription("Timeout a member")

    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a member")
        .setRequired(true),
    )

    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("1m, 10m, 1h, 1d...")
        .setRequired(true),
    )

    .addStringOption((option) =>
      option.setName("reason").setDescription("Timeout reason"),
    )

    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");

    const duration = interaction.options.getString("duration");

    const reason =
      interaction.options.getString("reason") || "No reason provided";

    if (!member) {
      return interaction.reply({
        content: "❌ Member not found.",
        ephemeral: true,
      });
    }

    if (!member.moderatable) {
      return interaction.reply({
        content: "❌ I cannot timeout this member.",
        ephemeral: true,
      });
    }

    if (
      interaction.member.roles.highest.position <= member.roles.highest.position
    ) {
      return interaction.reply({
        content: "❌ You cannot timeout this member.",
        ephemeral: true,
      });
    }

    const time = ms(duration);

    if (!time) {
      return interaction.reply({
        content: "❌ Invalid duration.",
        ephemeral: true,
      });
    }

    if (time > 2419200000) {
      return interaction.reply({
        content: "❌ Maximum timeout is 28 days.",
        ephemeral: true,
      });
    }

    await member.timeout(time, reason);

    const embed = new EmbedBuilder()

      .setColor(0xfee75c)

      .setTitle("⏳ Member Timed Out")

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
          name: "⏱️ Duration",
          value: duration,
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
