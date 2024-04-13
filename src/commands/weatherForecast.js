import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { fetchWeather } from '../requests/weatherApi.js';
const WEATHER_FORECAST_DAYS = 5;

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
  })
  .addStringOption((option) => {
    return option
      .setName('days')
      .setDescription('Set how many day(s) to forecast');
  });

async function execute(interaction) {
  await interaction.deferReply();
  const location = interaction.options.getString('location');
  const unit = interaction.options.getString('unit');
  const days = interaction.options.getString('days') || WEATHER_FORECAST_DAYS;
  const isCelsius = unit === 'celsius';

  try {
    const { forecasts, locationName, current } = await fetchWeather(
      location,
      days
    );

    const embedsObject = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Weather forecast for ${locationName} for ${days} days.`)
      .setDescription(`Using the ${unit} System.`)
      .setTimestamp()
      .setFooter({
        text: 'Powered by the weatherapi.com',
      });

    const getTemperatureByUnit = (temperatureInC, temperatureInF) => {
      if (isCelsius) {
        return `${temperatureInC}°C`;
      }

      return `${temperatureInF}°F`;
    };

    const feelsLikeEmoji = (temperature) => {
      if (temperature <= 10) {
        return '🥶';
      } else if (temperature >= 25) {
        return '🥵';
      } else {
        return '😐';
      }
    };

    embedsObject.addFields({
      name: `Now`,
      value: `${getTemperatureByUnit(current.feelsLikeC, current.feelsLikeF)} 👉  ${feelsLikeEmoji(current.feelsLikeC)}`,
    });

    for (let forecast of forecasts) {
      embedsObject.addFields({
        name: forecast.date,
        value: `⬇️  Low: ${getTemperatureByUnit(forecast.maxTempC, forecast.maxTempF)} ⬆️  High: ${getTemperatureByUnit(forecast.maxTempC, forecast.maxTempF)} \n\n 🌇 UV: ${forecast.uv}, 💨 Humidity: ${forecast.avgHumidity}% \n\n Condition: ${forecast.condition}`,
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
