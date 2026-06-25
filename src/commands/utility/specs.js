const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("specs")
    .setDescription("Send hardware specifications panel"),

  async execute(interaction) {
    const allowedUsers = ["1344542854235557970"];

    if (!allowedUsers.includes(interaction.user.id)) {
      return interaction.reply({
        content: "❌ You are not allowed to use this command.",
        ephemeral: true,
      });
    }
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("🖥️ HARDWARE SPECIFICATION")
      .setDescription(
        `• ⚙️ **CPU :** Ryzen 5 9600X
• 🎮 **GPU :** Radeon RX 9070 XT
• 🧠 **RAM :** 32GB DDR5`,
      );

    // إرسال الرسالة في القناة
    await interaction.channel.send({
      embeds: [embed],
    });

    // رد مخفي لمنع ظهور "Application did not respond"
    return interaction.reply({
      content: "✅ Specs panel sent.",
      ephemeral: true,
    });
  },
};
