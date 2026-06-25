const fs = require("fs");
const path = require("path");

module.exports = async (client) => {
  client.commands = new Map();

  const commandsPath = path.join(__dirname, "../commands");

  const folders = fs.readdirSync(commandsPath);

  for (const folder of folders) {
    const folderPath = path.join(commandsPath, folder);

    const files = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(folderPath, file);

      const command = require(filePath);

      if (!command.data) continue;

      client.commands.set(command.data.name, command);

      console.log(`⚡ Loaded Command: ${command.data.name}`);
    }
  }
};
