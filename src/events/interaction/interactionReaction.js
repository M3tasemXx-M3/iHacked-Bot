const pollModule = require("../../commands/utility/poll");

module.exports = {
  name: "messageReactionAdd",

  async execute(reaction, user) {
    if (user.bot) return;

    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    const poll = pollModule.polls.get(reaction.message.id);
    if (!poll) return;

    const emoji = reaction.emoji.name;
    const index = poll.emojis.indexOf(emoji);

    if (index === -1) return;

    if (poll.users.has(user.id)) {
      await reaction.users.remove(user.id);
      return;
    }

    poll.users.add(user.id);
    poll.votes[index]++;
  },
};
