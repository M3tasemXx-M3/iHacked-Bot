const fs = require("fs");
const path = require("path");

const folders = [
  "src",

  "src/core",
  "src/config",

  "src/database",
  "src/database/models",
  "src/database/tables",

  "src/commands",
  "src/commands/moderation",
  "src/commands/administration",
  "src/commands/utility",
  "src/commands/security",

  "src/events",
  "src/events/client",
  "src/events/guild",
  "src/events/message",
  "src/events/member",
  "src/events/interaction",

  "src/interactions",
  "src/interactions/buttons",
  "src/interactions/buttons/panel",
  "src/interactions/buttons/moderation",
  "src/interactions/buttons/tickets",
  "src/interactions/selectMenus",
  "src/interactions/modals",

  "src/systems",
  "src/systems/moderation",
  "src/systems/security",
  "src/systems/panels",
  "src/systems/logs",

  "src/assets",
  "src/assets/images",
  "src/assets/icons",
  "src/assets/banners",

  "src/utils",

  "logs",
  "logs/errors",
  "logs/moderation",
  "logs/commands",

  "data",
  "data/cache",
  "data/backups",
  "data/temp",
];

const files = {
  // ROOT
  "index.js": `require("dotenv").config();

console.log("🚀 iHacked-Core Started");
`,

  ".env": `TOKEN=
CLIENT_ID=
GUILD_ID=
`,

  ".gitignore": `node_modules
.env
logs
data/cache
`,

  "README.md": `# iHacked-Core
Professional Discord Moderation Bot
`,

  // CORE
  "src/core/client.js": `const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

module.exports = client;
`,

  "src/core/loader.js": `module.exports = async () => {
  console.log("📦 Loader Initialized");
};
`,

  "src/core/deploy.js": `module.exports = async () => {
  console.log("⚡ Slash Commands Deployed");
};
`,

  "src/core/logger.js": `module.exports = {
  info: (msg) => console.log("📘 " + msg),
  success: (msg) => console.log("✅ " + msg),
  error: (msg) => console.log("❌ " + msg)
};
`,

  "src/core/events.js": `module.exports = async () => {
  console.log("📡 Events Loaded");
};
`,

  "src/core/interactions.js": `module.exports = async () => {
  console.log("🧩 Interactions Loaded");
};
`,

  "src/core/permissions.js": `module.exports = {};
`,

  // CONFIG
  "src/config/bot.js": `module.exports = {
  name: "iHacked-Core",
  version: "1.0.0"
};
`,

  "src/config/colors.js": `module.exports = {
  primary: 0x5865F2,
  success: 0x57F287,
  error: 0xED4245
};
`,

  "src/config/emojis.js": `module.exports = {
  success: "✅",
  error: "❌",
  loading: "⏳"
};
`,

  "src/config/settings.js": `module.exports = {};
`,

  // DATABASE
  "src/database/sqlite.js": `const Database = require("better-sqlite3");

const db = new Database("./data/database.sqlite");

console.log("🗄️ SQLite Connected");

module.exports = db;
`,

  "src/database/models/userModel.js": `module.exports = {};`,
  "src/database/models/warningModel.js": `module.exports = {};`,
  "src/database/models/guildModel.js": `module.exports = {};`,

  "src/database/tables/users.sql": `CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY
);
`,

  "src/database/tables/warnings.sql": `CREATE TABLE IF NOT EXISTS warnings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  reason TEXT
);
`,

  "src/database/tables/guilds.sql": `CREATE TABLE IF NOT EXISTS guilds (
  guild_id TEXT PRIMARY KEY
);
`,

  // COMMANDS
  "src/commands/moderation/ban.js": `module.exports = {
  data: {
    name: "ban"
  },

  async execute(interaction) {

  }
};
`,

  "src/commands/moderation/kick.js": `module.exports = {
  data: {
    name: "kick"
  },

  async execute(interaction) {

  }
};
`,

  "src/commands/moderation/timeout.js": `module.exports = {
  data: {
    name: "timeout"
  },

  async execute(interaction) {

  }
};
`,

  "src/commands/moderation/clear.js": `module.exports = {
  data: {
    name: "clear"
  },

  async execute(interaction) {

  }
};
`,

  "src/commands/moderation/slowmode.js": `module.exports = {
  data: {
    name: "slowmode"
  },

  async execute(interaction) {

  }
};
`,

  "src/commands/administration/panel.js": `module.exports = {
  data: {
    name: "panel"
  },

  async execute(interaction) {

  }
};
`,

  "src/commands/administration/reload.js": `module.exports = {};`,

  "src/commands/administration/restart.js": `module.exports = {};`,

  "src/commands/administration/stats.js": `module.exports = {};`,

  "src/commands/utility/ping.js": `module.exports = {
  data: {
    name: "ping"
  },

  async execute(interaction) {
    await interaction.reply("🏓 Pong!");
  }
};
`,

  "src/commands/utility/help.js": `module.exports = {};`,

  "src/commands/security/protect.js": `module.exports = {};`,

  "src/commands/security/automod.js": `module.exports = {};`,

  // EVENTS
  "src/events/client/ready.js": `module.exports = {
  name: "ready",
  once: true,

  execute(client) {
    console.log(\`✅ Logged in as \${client.user.tag}\`);
  }
};
`,

  "src/events/client/error.js": `module.exports = {
  name: "error",

  execute(error) {
    console.log(error);
  }
};
`,

  "src/events/message/antiMention.js": `const protectedUsers = [];

module.exports = {
  name: "messageCreate",

  async execute(message) {

    if (message.author.bot) return;

    for (const user of message.mentions.users.values()) {

      if (protectedUsers.includes(user.id)) {

        await message.delete().catch(() => {});

        return message.channel.send({
          content:
          "🚫 You cannot mention this user."
        });
      }
    }
  }
};
`,

  "src/events/interaction/interactionCreate.js": `module.exports = {
  name: "interactionCreate",

  async execute(interaction) {

  }
};
`,

  "src/events/member/join.js": `module.exports = {
  name: "guildMemberAdd",

  async execute(member) {

  }
};
`,

  "src/events/member/leave.js": `module.exports = {
  name: "guildMemberRemove",

  async execute(member) {

  }
};
`,

  // SYSTEMS
  "src/systems/moderation/punishments.js": `module.exports = {};`,

  "src/systems/moderation/automod.js": `module.exports = {};`,

  "src/systems/security/antiRaid.js": `module.exports = {};`,

  "src/systems/security/antiMention.js": `module.exports = {};`,

  "src/systems/security/protectedUsers.js": `module.exports = [];
`,

  "src/systems/panels/mainPanel.js": `module.exports = {};`,

  "src/systems/logs/modLogs.js": `module.exports = {};`,

  // INTERACTIONS
  "src/interactions/selectMenus/mainPanel.js": `module.exports = {};`,

  "src/interactions/modals/embedModal.js": `module.exports = {};`,

  // UTILS
  "src/utils/embeds.js": `const { EmbedBuilder } = require("discord.js");

module.exports = {
  success: (message) =>
    new EmbedBuilder()
      .setColor(0x57F287)
      .setDescription(message)
};
`,

  "src/utils/constants.js": `module.exports = {};
`,
};

console.log("🚀 Creating project structure...\n");

for (const folder of folders) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, {
      recursive: true,
    });

    console.log("📁 " + folder);
  }
}

for (const filePath in files) {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }

  fs.writeFileSync(filePath, files[filePath]);

  console.log("📄 " + filePath);
}

console.log("\n✅ iHacked-Core setup completed.");
