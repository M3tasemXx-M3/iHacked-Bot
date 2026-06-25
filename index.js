require("dotenv").config();

const client = require("./src/core/client");

const initDatabase = require("./src/database/init");

const loadCommands = require("./src/core/loader");

const loadEvents = require("./src/core/events");

const loadInteractions = require("./src/core/interactions");

const deployCommands = require("./src/core/deploy");

(async () => {
  console.log("🚀 Starting iHacked-Core...");

  initDatabase();

  require("./src/database/shopItems");

  await loadCommands(client);

  await loadEvents(client);

  await loadInteractions(client);

  await deployCommands(client);

  client.login(process.env.TOKEN);
})();
