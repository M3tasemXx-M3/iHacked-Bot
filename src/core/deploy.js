const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

module.exports = async () => {
  const commands = [];

  const commandsPath = path.join(__dirname, "../commands");

  const folders = fs.readdirSync(commandsPath);

  console.log("\n📦 Loading Commands...\n");

  for (const folder of folders) {
    const folderPath = path.join(commandsPath, folder);

    const files = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(folderPath, file);

      try {
        delete require.cache[require.resolve(filePath)];

        const command = require(filePath);

        if (!command.data) {
          console.log(`⚠️ Skipped: ${file}`);
          continue;
        }

        const json = command.data.toJSON();

        commands.push(json);

        console.log(`✅ ${json.name}`);
      } catch (error) {
        console.log("\n━━━━━━━━━━━━━━━━━━━━━━");

        console.log(`❌ COMMAND ERROR`);

        console.log(`📄 File: ${filePath}`);

        console.log("━━━━━━━━━━━━━━━━━━━━━━\n");

        console.error(error);

        return;
      }
    }
  }

  try {
    console.log(`\n🚀 Deploying ${commands.length} Commands...\n`);

    const rest = new REST({
      version: "10",
    }).setToken(process.env.TOKEN);

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      {
        body: commands,
      },
    );

    console.log(`✅ Successfully deployed ${commands.length} commands`);
  } catch (error) {
    console.log("\n❌ DEPLOY FAILED\n");

    console.error(error);
  }
};
