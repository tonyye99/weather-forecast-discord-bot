import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const rest = new REST({
    version: '10',
}).setToken(process.env.DISCORD_TOKEN);

async function clientReadyHandler(client) {
    try {
        console.log(`Started with ${client.commands.size} commands`);

        const data = await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            {
                body: client.commands.map((command) => {
                    return command.data.toJSON();
                }),
            }
        );

        console.log(`Successfully loaded with ${data.length} commands`);
    } catch (error) {
        console.error(error);
    }
}

export { clientReadyHandler };
