const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const mods = require("../../systems/mods/modsData");

module.exports = {
  customId: "mods_menu",

  async execute(interaction) {
    const selected = interaction.values?.[0];
    const mod = mods?.[selected];

    if (!mod) {
      return interaction.reply({
        content: "❌ Mod not found.",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(mod.color ?? 0x00ff99)
      .setTitle(`🧩 ${mod.name ?? "Unknown Mod"}`)
      .setDescription(mod.description ?? "No description available")
      .addFields({
        name: "📦 Version",
        value: mod.version ?? "Unknown",
        inline: true,
      })
      .setThumbnail(mod.image ?? null);

    const components = [];

    const row = new ActionRowBuilder();

    // زر التحميل (آمن)
    if (mod.download) {
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Download")
          .setStyle(ButtonStyle.Link)
          .setURL(mod.download),
      );
    }

    // زر Modrinth (آمن)
    if (selected) {
      row.addComponents(
        new ButtonBuilder()
          .setLabel("Modrinth")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://modrinth.com/mod/${selected}`),
      );
    }

    if (row.components.length > 0) {
      components.push(row);
    }

    return interaction.reply({
      embeds: [embed],
      components,
      ephemeral: true,
    });
  },
};
