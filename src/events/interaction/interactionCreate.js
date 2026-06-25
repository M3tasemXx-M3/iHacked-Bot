const fs = require("fs");
const path = require("path");

module.exports = {
  name: "interactionCreate",

  async execute(interaction) {
    const client = interaction.client;

    try {
      // Slash Commands

      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        return command.execute(interaction);
      }

      // Buttons

      if (interaction.isButton()) {
        const buttonsPath = path.join(__dirname, "../../interactions/buttons");

        const loadButtons = (dir) => {
          const files = fs.readdirSync(dir);

          for (const file of files) {
            const filePath = path.join(dir, file);

            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
              const result = loadButtons(filePath);

              if (result) return result;
            } else if (file.endsWith(".js")) {
              delete require.cache[require.resolve(filePath)];

              const button = require(filePath);

              if (button.customId === interaction.customId) {
                return button;
              }
            }
          }

          return null;
        };

        const button = loadButtons(buttonsPath);

        if (button) {
          return button.execute(interaction);
        }
      }

      // Select Menus

      if (interaction.isStringSelectMenu()) {
        const menusPath = path.join(
          __dirname,
          "../../interactions/selectMenus",
        );

        const files = fs.readdirSync(menusPath);

        for (const file of files) {
          const menu = require(path.join(menusPath, file));

          if (menu.customId === interaction.customId) {
            return menu.execute(interaction);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
