const fs = require("fs");
const path = require("path");

// =====================
// caches (FAST ACCESS)
// =====================
const selectMenus = new Map();
const buttons = new Map();
const modals = new Map();

// =====================
// LOAD SELECT MENUS
// =====================
const menusPath = path.join(__dirname, "./selectMenus");

if (fs.existsSync(menusPath)) {
  for (const file of fs.readdirSync(menusPath)) {
    const menu = require(path.join(menusPath, file));
    if (menu.customId) selectMenus.set(menu.customId, menu);
  }
}

// =====================
// LOAD BUTTONS
// =====================
const buttonsPath = path.join(__dirname, "./buttons");

if (fs.existsSync(buttonsPath)) {
  for (const file of fs.readdirSync(buttonsPath)) {
    const button = require(path.join(buttonsPath, file));
    if (button.customId) buttons.set(button.customId, button);
  }
}

// =====================
// EMBED SESSION SYSTEM
// =====================
const embedSession = require("../commands/utility/embed").sessions;

const PRESETS = {
  gaming: {
    color: 0x2ecc71,
    title: "🎮 Gaming Panel",
    description: "Gaming system embed",
  },
  announcement: {
    color: 0xe67e22,
    title: "📢 Announcement",
    description: "Official announcement",
  },
  admin: {
    color: 0x9b59b6,
    title: "🛡️ Admin Panel",
    description: "Administrative message",
  },
};

module.exports = async (interaction) => {
  const userId = interaction.user.id;

  const session = embedSession.get(userId);

  // ======================
  // BUTTONS
  // ======================
  if (interaction.isButton()) {
    const button = buttons.get(interaction.customId);

    // ---- embed system buttons ----
    if (session) {
      const id = interaction.customId;

      if (id === "embed_send") {
        const { EmbedBuilder } = require("discord.js");

        const embed = new EmbedBuilder()
          .setColor(session.color)
          .setTitle(session.title)
          .setDescription(session.description);

        if (session.image) embed.setImage(session.image);
        if (session.thumbnail) embed.setThumbnail(session.thumbnail);

        embedSession.delete(userId);

        return interaction.reply({ embeds: [embed] });
      }

      if (id === "embed_cancel") {
        embedSession.delete(userId);

        return interaction.reply({
          content: "❌ Embed cancelled",
          ephemeral: true,
        });
      }

      if (id === "embed_edit") {
        return interaction.reply({
          content: "Use menu to edit embed",
          ephemeral: true,
        });
      }
    }

    // normal buttons
    if (button) return button.execute(interaction);
  }

  // ======================
  // SELECT MENUS
  // ======================
  if (interaction.isStringSelectMenu()) {
    const menu = selectMenus.get(interaction.customId);

    // ---- embed builder menu ----
    if (session) {
      const value = interaction.values[0];

      if (value === "preset") {
        const {
          StringSelectMenuBuilder,
          ActionRowBuilder,
        } = require("discord.js");

        const menu = new StringSelectMenuBuilder()
          .setCustomId("embed_preset_select")
          .setPlaceholder("Choose preset")
          .addOptions(
            Object.keys(PRESETS).map((p) => ({
              label: p,
              value: p,
            })),
          );

        return interaction.reply({
          components: [new ActionRowBuilder().addComponents(menu)],
          ephemeral: true,
        });
      }

      const {
        ModalBuilder,
        TextInputBuilder,
        TextInputStyle,
        ActionRowBuilder,
      } = require("discord.js");

      const modal = new ModalBuilder()
        .setCustomId(`embed_modal_${value}`)
        .setTitle("Embed Editor");

      const input = new TextInputBuilder()
        .setCustomId("value")
        .setLabel(`Enter ${value}`)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder().addComponents(input));

      return interaction.showModal(modal);
    }

    if (menu) return menu.execute(interaction);
  }

  // ======================
  // MODALS
  // ======================
  if (interaction.isModalSubmit()) {
    if (!session) return;

    const field = interaction.customId.split("_")[2];
    const value = interaction.fields.getTextInputValue("value");

    if (field === "title") session.title = value;
    if (field === "description") session.description = value;
    if (field === "color") session.color = parseInt(value.replace("#", ""), 16);
    if (field === "image") session.image = value;
    if (field === "thumbnail") session.thumbnail = value;

    const { EmbedBuilder } = require("discord.js");

    const embed = new EmbedBuilder()
      .setColor(session.color)
      .setTitle(session.title)
      .setDescription(session.description);

    if (session.image) embed.setImage(session.image);
    if (session.thumbnail) embed.setThumbnail(session.thumbnail);

    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }
};
