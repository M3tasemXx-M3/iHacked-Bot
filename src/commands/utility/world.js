const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("world")
    .setDescription("Send world information panel"),

  async execute(interaction) {
    const allowedUsers = ["1344542854235557970"];

    if (!allowedUsers.includes(interaction.user.id)) {
      return interaction.reply({
        content: "❌ You are not allowed to use this command.",
        ephemeral: true,
      });
    }
    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle("🌍 WORLD DATA CORE")
      .setDescription(
        `• 🌱 **Type :** Large Biomes
• 📦 **Version :** 1.21.11 updated to 26.2
• ⚔️ **Difficulty :** Hard
• 🏕️ **Mode :** Survival
• 🌍 **Seed :** \`589971555665292746\``,
      );

    // إرسال الرسالة في القناة بدون رد مباشر
    await interaction.channel.send({
      embeds: [embed],
    });

    // رد مخفي حتى لا يظهر "Application did not respond"
    return interaction.reply({
      content: "✅ World panel sent.",
      ephemeral: true,
    });
  },
};
