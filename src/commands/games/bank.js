const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const GameStats = require("../../database/models/gameStatsModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bank")
    .setDescription(
      "View your current wallet balance, bank savings, and outstanding debt.",
    ),

  async execute(interaction) {
    // Fetch the user's financial profile from SQLite
    const account = GameStats.get(interaction.user.id);

    if (!account) {
      return interaction.reply({
        content: "❌ You don't have an active account registry in the system.",
        ephemeral: true,
      });
    }

    // Define values and handle fallback defaults if columns are newly initialized
    const walletCash = account.coins || 0;
    const bankSavings = account.bank || 0;
    const bankDebt = account.debt || 0; // Dynamically reads 'debt' column from your game_stats rows

    // Calculate total net worth (Cash + Bank - Debt)
    const netWorth = walletCash + bankSavings - bankDebt;

    // Determine Net Worth Status indicator color & emoji
    let statusEmoji = "📊";
    let embedColor = "#3b82f6"; // Default elegant bank blue

    if (netWorth < 0) {
      statusEmoji = "⚠️";
      embedColor = "#f59e0b"; // Warning amber if heavily in debt
    } else if (netWorth > 1000000) {
      statusEmoji = "👑";
      embedColor = "#eab308"; // Golden tier for millionaires
    }

    // Construct the elegant financial statement embed
    const bankEmbed = new EmbedBuilder()
      .setColor(embedColor)
      .setAuthor({
        name: `${interaction.user.username}'s Financial Statement`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        "### 🏦 Central Bank of Bot City\nYour encrypted real-time financial ledger accounting overview has been loaded successfully.",
      )
      .addFields(
        {
          name: "👛 Wallet Cash",
          value: `\`$${walletCash.toLocaleString()}\` Coins`,
          inline: true,
        },
        {
          name: "💳 Bank Savings",
          value: `\`$${bankSavings.toLocaleString()}\` Coins`,
          inline: true,
        },
        {
          name: "📉 Outstanding Debt",
          value: `\`$${bankDebt.toLocaleString()}\` Coins`,
          inline: true,
        },
        {
          name: `${statusEmoji} Total Net Worth`,
          value: `**\`$${netWorth.toLocaleString()}\` Coins**`,
          inline: false,
        },
      )
      .setFooter({ text: "Secure Banking Protocol • Verified Ledger Sync" })
      .setTimestamp();

    return interaction.reply({ embeds: [bankEmbed] });
  },
};
