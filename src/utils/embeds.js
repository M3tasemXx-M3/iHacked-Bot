const { EmbedBuilder } = require("discord.js");

module.exports = {
  success: (message) =>
    new EmbedBuilder()
      .setColor(0x57F287)
      .setDescription(message)
};
