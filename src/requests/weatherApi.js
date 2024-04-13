import axios from 'axios';

const WEATHER_API_URL = 'https://api.weatherapi.com/v1/forecast.json';
const WEATHER_FORECAST_DAYS = 5;

async function fetchWeather(location) {
  return await axios({
    url: WEATHER_API_URL,
    method: 'get',
    params: {
      q: location,
      days: WEATHER_FORECAST_DAYS,
      key: process.env.WEATHER_API_KEY,
    },
    responseType: 'json',
  })
    .then((response) => {
      const locationName = response.data.location.name;
      const forecasts = response.data.forecast.forecastday.map((day) => {
        return {
          maxTempC: day.day.maxtemp_c,
          maxTempF: day.day.maxtemp_f,
          minTempC: day.day.mintemp_c,
          minTempF: day.day.mintemp_f,
          date: day.date,
        };
      });

      return {
        locationName,
        forecasts,
      };
    })
    .catch((error) => {
      console.error(error);
      throw new Error(`Unable to fetch Weather for location: ${location}`);
    });
}

export { fetchWeather };
