const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Shop = require("../../database/models/shopModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription(
      "Browse premium cosmetics and profile cards available for purchase.",
    ),

  async execute(interaction) {
    const items = Shop.getItems();

    if (!items || items.length === 0) {
      return interaction.reply({
        content: "🛒 The shop is currently empty. Check back later!",
        ephemeral: true,
      });
    }

    const shopEmbed = new EmbedBuilder()
      .setColor("#facc15")
      .setAuthor({
        name: "Bot Central Market",
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setDescription(
        "### 🛒 Premium Customization Shop\nUse `/buy [item_id]` to acquire your cosmetic background modifications.",
      )
      .setFooter({ text: "Marketplace Ledger • Items non-refundable" })
      .setTimestamp();

    // Map database entries into elegant layout fields
    items.forEach((item) => {
      shopEmbed.addFields({
        name: `✨ ${item.name}`,
        value: `💰 Price: \`$${item.price.toLocaleString()}\` Coins\n🆔 Buy ID: \`${item.id}\``,
        inline: true,
      });
    });

    return interaction.reply({ embeds: [shopEmbed] });
  },
};
