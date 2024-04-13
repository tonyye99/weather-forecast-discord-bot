import 'dotenv/config';
import { Client, GatewayIntentBits, Events, Collection } from 'discord.js';
import { clientReadyHandler } from './events/clientReady.js';
import pingCommand from './commands/ping.js';
import weatherForecastCommand from './commands/weatherForecast.js';
import { interactionCreateHanlder } from './events/interactionCreate.js';

const client = new Client({
  intents: GatewayIntentBits.Guilds,
});

client.commands = new Collection();

client.commands.set(pingCommand.data.name, pingCommand);
client.commands.set(weatherForecastCommand.data.name, weatherForecastCommand);

client.once(Events.ClientReady, clientReadyHandler);

client.on(Events.InteractionCreate, interactionCreateHanlder);

client.login(process.env.DISCORD_TOKEN);
