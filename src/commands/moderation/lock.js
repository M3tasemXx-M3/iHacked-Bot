const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("lock")

    .setDescription("Lock channel")

    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,

      {
        SendMessages: false,
      },
    );

    const embed = new EmbedBuilder()

      .setColor(0xed4245)

      .setTitle("🔒 Channel Locked")

      .setDescription("This channel has been locked.");

    await interaction.reply({
      embeds: [embed],
    });
  },
};
