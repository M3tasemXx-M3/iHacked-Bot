const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Create a custom embed message")
    .addStringOption((opt) =>
      opt.setName("title").setDescription("Embed title").setRequired(true),
    )
    .addStringOption((opt) =>
      opt
        .setName("description")
        .setDescription("Embed description")
        .setRequired(true),
    )
    .addStringOption((opt) =>
      opt
        .setName("color")
        .setDescription("Hex color like #00ff99")
        .setRequired(false),
    )
    .addStringOption((opt) =>
      opt.setName("image").setDescription("Image URL").setRequired(false),
    ),

  async execute(interaction) {
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const color = interaction.options.getString("color") || "#2b2d31";
    const image = interaction.options.getString("image");

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setTimestamp()
      .setFooter({ text: interaction.user.username });

    if (image) embed.setImage(image);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
