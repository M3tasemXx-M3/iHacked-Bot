const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const GameStats = require("../../database/models/gameStatsModel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription(
      "Rob a player or pull off a high-stakes bank heist on the Bot!",
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(
          "Target player (Select the bot to rob the Central Bank)",
        )
        .setRequired(true),
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const now = Date.now();
    const cooldown = 10 * 60 * 1000; // 10 Minutes Cooldown

    // 1. Prevent robbing self
    if (target.id === interaction.user.id) {
      return interaction.reply({
        content: "❌ You can't rob yourself.",
        ephemeral: true,
      });
    }

    const robber = GameStats.get(interaction.user.id);

    // 2. Precise Cooldown Check (Minutes & Seconds)
    if (now - robber.lastRob < cooldown) {
      const remainingMs = cooldown - (now - robber.lastRob);
      const minutes = Math.floor(remainingMs / 60000);
      const seconds = Math.floor((remainingMs % 60000) / 1000);

      return interaction.reply({
        content: `⏳ **Robbery Cooldown Active!**\nPlease wait **${minutes}m ${seconds}s** before planning your next crime heist.`,
        ephemeral: true,
      });
    }

    /* =========================================================================
       [ MECHANIC A: Central Bank Heist (If Target is the Bot) ]
       ========================================================================= */
    if (target.id === interaction.client.user.id) {
      GameStats.setLastRob(interaction.user.id);

      // 12% Success Rate for the huge jackpot balance
      const bankSuccess = Math.random() < 0.12;

      if (bankSuccess) {
        const minReward = 5000000;
        const maxReward = 100000000;
        const stolen =
          Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;

        GameStats.addCoins(interaction.user.id, stolen);
        GameStats.addRobSuccess(interaction.user.id);

        const bankSuccessEmbed = new EmbedBuilder()
          .setColor("#22c55e")
          .setAuthor({
            name: "🚨 CENTRAL BANK HEIST SUCCESSFUL",
            iconURL: interaction.client.user.displayAvatarURL(),
          })
          .setDescription(
            "### 🎰 WE ARE IN THE VAULT! \nYou completely bypassed the high-voltage laser grids, hacked the mainframes, and made it out alive with the jackpot!",
          )
          .addFields(
            {
              name: "💵 Loot Acquired",
              value: `\`$${stolen.toLocaleString()}\` Coins`,
              inline: true,
            },
            {
              name: "🥷 Operative",
              value: `${interaction.user}`,
              inline: true,
            },
            {
              name: "📈 Current Status",
              value: `👑 Wanted Legend`,
              inline: false,
            },
          )
          .setFooter({
            text: "Central Bank System • Security Breached",
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp();

        return interaction.reply({ embeds: [bankSuccessEmbed] });
      } else {
        const fine = Math.floor(Math.random() * 50000) + 25000;
        const actualFine = Math.min(robber.coins, fine);

        GameStats.removeCoins(interaction.user.id, actualFine);
        GameStats.addRobFail(interaction.user.id);

        const bankFailEmbed = new EmbedBuilder()
          .setColor("#ef4444")
          .setAuthor({
            name: "🚔 HEIST FAILED - BUSTED",
            iconURL: interaction.client.user.displayAvatarURL(),
          })
          .setDescription(
            "### 🚨 SWAT TEAM AMBUSH! \nThe silent pressure-sensors inside the vault detected your footsteps. The perimeter was instantly locked down by heavy units.",
          )
          .addFields(
            {
              name: "💸 Bail Fine Paid",
              value: `\`$${actualFine.toLocaleString()}\` Coins`,
              inline: true,
            },
            {
              name: "🔒 Sentence Status",
              value: `👮 Behind Bars`,
              inline: true,
            },
          )
          .setFooter({
            text: "Central Bank System • Secure Perimeter Lockdown",
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp();

        return interaction.reply({ embeds: [bankFailEmbed] });
      }
    }

    // 3. Block interactions with other bots
    if (target.bot) {
      return interaction.reply({
        content:
          "❌ You can only target real players or this main bot to trigger a bank heist.",
        ephemeral: true,
      });
    }

    /* =========================================================================
       [ MECHANIC B: Regular Player Robbery ]
       ========================================================================= */
    const victim = GameStats.get(target.id);

    if (victim.coins < 500) {
      return interaction.reply({
        content: "❌ Target is too poor.",
        ephemeral: true,
      });
    }

    GameStats.setLastRob(interaction.user.id);
    const success = Math.random() < 0.4; // 40% Success Rate

    if (success) {
      const stolen = Math.floor(victim.coins * (Math.random() * 0.2 + 0.05));

      GameStats.removeCoins(target.id, stolen);
      GameStats.addCoins(interaction.user.id, stolen);
      GameStats.addRobSuccess(interaction.user.id);

      const playerSuccessEmbed = new EmbedBuilder()
        .setColor("#22c55e")
        .setAuthor({
          name: "🥷 STREET ROBBERY SUCCESSFUL",
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `You silently pickpocketed the target while they weren't paying attention. Clean job!`,
        )
        .addFields(
          { name: "🎯 Victim", value: `${target}`, inline: true },
          {
            name: "💰 Money Stolen",
            value: `\`$${stolen.toLocaleString()}\` Coins`,
            inline: true,
          },
        )
        .setFooter({ text: "Street Thievery Execution" })
        .setTimestamp();

      return interaction.reply({ embeds: [playerSuccessEmbed] });
    }

    // Failure branch for regular robbery
    const fine = Math.floor(Math.random() * 500) + 200;
    const actualFine = Math.min(robber.coins, fine);

    GameStats.removeCoins(interaction.user.id, actualFine);
    GameStats.addRobFail(interaction.user.id);

    const playerFailEmbed = new EmbedBuilder()
      .setColor("#ef4444")
      .setAuthor({
        name: "🚔 POLICE INTERVENTION",
        iconURL: target.displayAvatarURL(),
      })
      .setDescription(
        `You got caught red-handed trying to steal from ${target}. Nearby patrolling officers tackled you down!`,
      )
      .addFields(
        {
          name: "💸 Penalty Fine",
          value: `\`$${actualFine.toLocaleString()}\` Coins`,
          inline: true,
        },
        {
          name: "⚠️ Records Update",
          value: `Added to Criminal Registry`,
          inline: true,
        },
      )
      .setFooter({ text: "Failed Petty Theft Attempt" })
      .setTimestamp();

    return interaction.reply({ embeds: [playerFailEmbed] });
  },
};
