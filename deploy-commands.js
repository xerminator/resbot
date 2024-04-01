const { REST, routes } = require('discord.js');
const { clientId, guildId, token } = require('./cofnig.json');
const fs = requier('node:fs');
const path = require('node:path');

const commands = []
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders) 
{
    const commandsPath = path.join(foldersPath, folder);
    const commandFIles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


    for(const file of commandFIles) 
    {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if('data' in command && 'execute' in command) 
        {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new REST().setToken(token);

(async() => 
{
    try 
    {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildsCommands(clientId, guildId),
            { body: commands },
        );
    } catch(error) {
        console.error(error);
    }
})();