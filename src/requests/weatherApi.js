import axios from 'axios';

const WEATHER_API_URL = 'https://api.weatherapi.com/v1/forecast.json';

async function fetchWeather(location, days) {
  return await axios({
    url: WEATHER_API_URL,
    method: 'get',
    params: {
      q: location,
      days: days,
      key: process.env.WEATHER_API_KEY,
    },
    responseType: 'json',
  })
    .then((response) => {
      const locationName = response.data.location.name;
      const current = {
        feelsLikeC: response.data.current.feelslike_c,
        feelsLikeF: response.data.current.feelslike_f,
      };

      const forecasts = response.data.forecast.forecastday.map((day) => {
        return {
          date: day.date,
          avgHumidity: day.day.avghumidity,
          uv: day.day.uv,
          condition: day.day.condition.text,
          maxTempC: day.day.maxtemp_c,
          maxTempF: day.day.maxtemp_f,
          minTempC: day.day.mintemp_c,
          minTempF: day.day.mintemp_f,
        };
      });

      return {
        locationName,
        forecasts,
        current,
      };
    })
    .catch((error) => {
      console.error(error);
      throw new Error(`Unable to fetch Weather for location: ${location}`);
    });
}

export { fetchWeather };
