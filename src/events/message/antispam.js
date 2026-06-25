const cooldown = new Map();

module.exports = {
  name: "messageCreate",

  async execute(message) {
    if (message.author.bot) return;

    const user = message.author.id;

    if (!cooldown.has(user)) {
      cooldown.set(user, {
        messages: 1,
      });

      setTimeout(() => {
        cooldown.delete(user);
      }, 5000);

      return;
    }

    const data = cooldown.get(user);

    data.messages++;

    if (data.messages >= 6) {
      await message.delete().catch(() => {});

      return message.channel.send({
        content: `⚠️ ${message.author}

Please stop spamming.`,
      });
    }
  },
};
