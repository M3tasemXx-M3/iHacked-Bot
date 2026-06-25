const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Shop = require("../../database/models/shopModel");
const GameStats = require("../../database/models/gameStatsModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription(
      "Purchase a custom background or item from the shop registry.",
    )
    .addStringOption((option) =>
      option
        .setName("item_id")
        .setDescription(
          "The unique identifier string of the item (e.g., bg_cyan)",
        )
        .setRequired(true),
    ),

  async execute(interaction) {
    const itemId = interaction.options.getString("item_id").toLowerCase();
    const userId = interaction.user.id;

    // 1. Check if the item exists inside the shop database
    const item = Shop.getItem(itemId);
    if (!item) {
      return interaction.reply({
        content: `❌ **Invalid Item ID!** Please check the available list via \`/shop\` first.`,
        ephemeral: true,
      });
    }

    // 2. Check if the user already owns this item
    const alreadyOwned = Shop.hasItem(userId, itemId);
    if (alreadyOwned) {
      return interaction.reply({
        content: `❌ You already own **${item.name}** in your inventory collection registry!`,
        ephemeral: true,
      });
    }

    // 3. Fetch user statistics and wallet metrics
    const userWallet = GameStats.get(userId);
    if (!userWallet || userWallet.coins < item.price) {
      const missingCoins = item.price - (userWallet?.coins || 0);
      return interaction.reply({
        content: `❌ **Insufficient Funds!** You need \`$${missingCoins.toLocaleString()}\` more coins to purchase **${item.name}**.`,
        ephemeral: true,
      });
    }

    // 4. Processing transactions safely
    GameStats.removeCoins(userId, item.price); // Deduct currency from SQLite wallet
    Shop.buy(userId, item.id); // Append item entry into inventory table via shopModel

    // 5. Success feedback embed
    const purchaseEmbed = new EmbedBuilder()
      .setColor("#22c55e")
      .setAuthor({
        name: "TRANSACTION SECURED",
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `### 🎉 Purchase Successful!\nYou have successfully acquired a brand new asset for your account modifications.`,
      )
      .addFields(
        { name: "🛍️ Item Purchased", value: `\`${item.name}\``, inline: true },
        {
          name: "💸 Amount Debited",
          value: `\`$${item.price.toLocaleString()}\` Coins`,
          inline: true,
        },
        {
          name: "👛 Remaining Cash",
          value: `\`$${(userWallet.coins - item.price).toLocaleString()}\` Coins`,
          inline: false,
        },
      )
      .setFooter({ text: "Thank you for shopping at Central Bank!" })
      .setTimestamp();

    return interaction.reply({ embeds: [purchaseEmbed] });
  },
};
