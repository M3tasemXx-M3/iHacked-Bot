const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const GameStats = require("../../database/models/gameStatsModel");

const blackjack = require("../../systems/casino/blackjackGame");

const sessions = require("../../systems/casino/blackjackSessions");

module.exports = {
  data: new SlashCommandBuilder()

    .setName("blackjack")

    .setDescription("Play Blackjack")

    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Bet amount")
        .setRequired(true)
        .setMinValue(1),
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    const stats = GameStats.get(interaction.user.id);

    if (stats.coins < amount) {
      return interaction.reply({
        content: "❌ Not enough coins.",
        ephemeral: true,
      });
    }

    GameStats.removeCoins(interaction.user.id, amount);

    const playerHand = [blackjack.drawCard(), blackjack.drawCard()];

    const dealerHand = [blackjack.drawCard(), blackjack.drawCard()];

    sessions.set(interaction.user.id, {
      amount,
      playerHand,
      dealerHand,
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("bj_hit")
        .setLabel("Hit")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("bj_stand")
        .setLabel("Stand")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("bj_double")
        .setLabel("Double")
        .setStyle(ButtonStyle.Primary),
    );

    const embed = new EmbedBuilder()

      .setColor("#5865F2")

      .setTitle("🃏 Blackjack")

      .setDescription(
        `**Your Hand**
${playerHand.join(" ")}

Value: **${blackjack.calculate(playerHand)}**

**Dealer**
${dealerHand[0]} ❓`,
      );

    return interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
