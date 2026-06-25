const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Shop = require("../../database/models/shopModel");
const GameStats = require("../../database/models/gameStatsModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("use")
    .setDescription("Equip or use an item/theme from your inventory.")
    .addStringOption((option) =>
      option
        .setName("item_id")
        .setDescription("The ID of the item you want to use (e.g., bg_cyan)")
        .setRequired(true),
    ),

  async execute(interaction) {
    const itemId = interaction.options.getString("item_id").toLowerCase();
    const userId = interaction.user.id;

    // 1. التحقق من وجود الغرض في المتجر أصلاً
    const item = Shop.getItem(itemId);
    if (!item) {
      return interaction.reply({
        content: "❌ This item ID does not exist in the store registry.",
        ephemeral: true,
      });
    }

    // 2. التحقق من أن اللاعب يمتلك الغرض في حقيبته
    const hasItem = Shop.hasItem(userId, itemId);
    if (!hasItem) {
      return interaction.reply({
        content: `❌ You do not own **${item.name}**. Purchase it from the \`/shop\` first.`,
        ephemeral: true,
      });
    }

    // 3. إذا كان الغرض عبارة عن خلفية للبروفايل
    if (item.type === "background") {
      // حفظ الخلفية النشطة في قاعدة البيانات باستخدام الميثود الجديدة
      GameStats.setActiveBackground(userId, item.id);

      const useEmbed = new EmbedBuilder()
        .setColor("#22c55e")
        .setTitle("✨ Theme Equipped Successfully!")
        .setDescription(
          `You have successfully changed your profile background layout to **${item.name}**.\nRun \`/profile\` to view your new look!`,
        )
        .setTimestamp();

      return interaction.reply({ embeds: [useEmbed] });
    }

    // هنا يمكنك إضافة شروط أخرى مستقبلاً إذا أضفت أنواع جديدة (مثل الألقاب الفخرية title أو الإطارات frame)
    return interaction.reply({
      content: `⚠️ The item **${item.name}** is owned, but it does not have an assignable activation function.`,
      ephemeral: true,
    });
  },
};
