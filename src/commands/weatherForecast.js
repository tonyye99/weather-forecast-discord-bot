import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { fetchWeather } from '../requests/weatherApi.js';

const data = new SlashCommandBuilder()
  .setName('weather')
  .setDescription('Replies with the weather forecast!')
  .addStringOption((option) => {
    return option
      .setName('location')
      .setDescription(
        'The location can be a city, zip/postal code, or a latitude or longitude.'
      )
      .setRequired(true);
  })
  .addStringOption((option) => {
    return option
      .setName('unit')
      .setDescription('The unit can be either Celsius or Fahrenheit')
      .setRequired(true)
      .addChoices(
        {
          name: 'Celsius',
          value: 'celsius',
        },
        {
          name: 'Fahrenheit',
          value: 'fahrenheit',
        }
      );
  });

async function execute(interaction) {
  await interaction.deferReply();
  const location = interaction.options.getString('location');
  const unit = interaction.options.getString('unit');
  const isCelsius = unit === 'celsius';

  try {
    const { forecasts, locationName } = await fetchWeather(location);

    const embedsObject = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Weather forecast for ${locationName} for 5 days.`)
      .setDescription(`Using the ${unit} System.`)
      .setTimestamp()
      .setFooter({
        text: 'Powered by the weatherapi.com',
      });

    for (let forecast of forecasts) {
      embedsObject.addFields({
        name: forecast.date,
        value: ` ⬆️ Low: ${isCelsius ? forecast.minTempC + '°C' : forecast.minTempF + '°F'}, ⬇️ High: ${isCelsius ? forecast.maxTempC + '°C' : forecast.maxTempF + '°F'}`,
      });
    }

    await interaction.editReply({
      embeds: [embedsObject],
    });
  } catch (error) {
    await interaction.editReply(error);
  }
}

export default { data, execute };
