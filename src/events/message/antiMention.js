const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const {
  protectedUsers,
  whitelistedUsers,
  whitelistedRoles,
} = require("../../systems/security/mentionProtection");

module.exports = {
  name: "messageCreate",

  async execute(message) {
    if (!message.guild) return;
    if (message.author.bot) return;

    const member = message.member;

    // Administrator Bypass
    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      return;
    }

    // User Whitelist
    if (whitelistedUsers.includes(message.author.id)) {
      return;
    }

    // Role Whitelist
    if (member.roles.cache.some((role) => whitelistedRoles.includes(role.id))) {
      return;
    }

    // Check for protected user mention
    const protectedMention = message.mentions.users.find((user) =>
      protectedUsers.includes(user.id),
    );

    if (!protectedMention) return;

    // Delete message
    await message.delete().catch(() => {});

    // DM Warning
    try {
      const embed = new EmbedBuilder()
        .setColor("#F39C12")
        .setTitle("⚠️ Protected User Mention")
        .setDescription(
          [
            "⚠️ Please do not mention this user unless the situation requires immediate attention or is considered an emergency.",
            "",
            "📨 If you require assistance, have questions, or need support, please contact the server administration team through the appropriate channels instead.",
            "",
            "Thank you for helping maintain a respectful and organized community environment.",
          ].join("\n"),
        )
        .setFooter({
          text: `${message.guild.name} • Security System`,
        })
        .setTimestamp();

      await message.author.send({
        embeds: [embed],
      });
    } catch {}

    // Temporary channel notification
    const warning = await message.channel
      .send({
        content: `⚠️ ${message.author} Your message was removed because it contained a protected user mention.`,
      })
      .catch(() => null);

    if (warning) {
      setTimeout(() => {
        warning.delete().catch(() => {});
      }, 5000);
    }
  },
};
