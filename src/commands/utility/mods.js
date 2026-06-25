const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

const mods = require("../../systems/mods/modsData");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mods")
    .setDescription("Open mods control panel"),

  async execute(interaction) {
    const allowedUsers = ["1344542854235557970"];

    if (!allowedUsers.includes(interaction.user.id)) {
      return interaction.reply({
        content: "❌ You are not allowed to use this command.",
        ephemeral: true,
      });
    }
    const emojis = [
      "⚡",
      "🧠",
      "🧱",
      "🚀",
      "👁️",
      "🌈",
      "🌄",
      "📋",
      "🖥️",
      "⏪",
      "🏗️",
      "📐",
      "📊",
      "🎒",
      "🔧",
      "📦",
      "🛠️",
      "➕",
      "🚆",
    ];

    const modNames = Object.values(mods)
      .map((mod, index) => `${emojis[index % emojis.length]} ${mod.name}`)
      .join("\n");

    const totalMods = Object.keys(mods).length;

    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle("🧩 MODS CONTROL MATRIX")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1487715697994891376/1495202555599257753/logo_Image_3.png?ex=6a162ae4&is=6a14d964&hm=9b9c6209ad40e33093d39c005a5bf6b04cd2efbf43a732bc1f93e49b2965f830&",
      )
      .setDescription(
        `⚙️ **Minecraft Modpack Initialization Complete**

📦 **Total Mods:** ${totalMods}

📜 **Installed Mods:**
${modNames}

━━━━━━━━━━━━━━━━━━
🟢 Optimization | 🎮 UI | 🧰 Utilities | 📚 Libraries
━━━━━━━━━━━━━━━━━━`,
      );

    const menu = new StringSelectMenuBuilder()
      .setCustomId("mods_menu")
      .setPlaceholder("🚀 Select a mod...")

      .addOptions(
        Object.entries(mods).map(([key, mod], index) => ({
          label: mod.name,
          value: key,
          emoji: emojis[index % emojis.length],
          description: (mod.description || "No description").slice(0, 80),
        })),
      );

    const row = new ActionRowBuilder().addComponents(menu);

    // إرسال الرسالة في القناة
    await interaction.channel.send({
      embeds: [embed],
      components: [row],
    });

    // حذف "bot is thinking..."
    return interaction.reply({
      content: "✅ Mods panel sent successfully.",
      ephemeral: true,
    });
  },
};
