const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Shop = require("../../database/models/shopModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("View your collected items and cosmetic themes."),

  async execute(interaction) {
    const items = Shop.getInventory(interaction.user.id);

    if (!items || items.length === 0) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#5865f2")
            .setTitle("🎒 Your Inventory")
            .setDescription(
              "Your inventory is currently empty. Buy some items from the `/shop`!",
            ),
        ],
      });
    }

    // تنسيق عرض الأغراض مع الـ ID الخاص بكل غرض لتسهيل عملية الاستخدام
    const listText = items
      .map(
        (item) =>
          `• **${item.name}** \n 🆔 Use ID: \`${item.id}\` | Type: \`${item.type}\``,
      )
      .join("\n\n");

    const invEmbed = new EmbedBuilder()
      .setColor("#5865f2")
      .setAuthor({
        name: `${interaction.user.username}'s Vault`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `### 🎒 Owned Items Collection\nTo equip or activate a theme, use:\n\`/use [item_id]\` \n\n${listText}`,
      )
      .setTimestamp();

    return interaction.reply({ embeds: [invEmbed] });
  },
};
