const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("unlock")

    .setDescription("Unlock channel")

    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,

      {
        SendMessages: null,
      },
    );

    const embed = new EmbedBuilder()

      .setColor(0x57f287)

      .setTitle("🔓 Channel Unlocked")

      .setDescription("This channel has been unlocked.");

    await interaction.reply({
      embeds: [embed],
    });
  },
};
