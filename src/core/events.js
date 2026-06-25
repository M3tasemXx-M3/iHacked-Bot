const fs = require("fs");
const path = require("path");

module.exports = async (client) => {
  const eventsPath = path.join(__dirname, "../events");

  const folders = fs.readdirSync(eventsPath);

  for (const folder of folders) {
    const folderPath = path.join(eventsPath, folder);

    const files = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(folderPath, file);

      const event = require(filePath);

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }

      console.log(`📡 Loaded Event: ${file}`);
    }
  }
};
