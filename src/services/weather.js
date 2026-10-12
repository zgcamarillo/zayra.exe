const getWeatherCode = (code) => {
  const weather = {
    0: {
      condition: "Clear sky",
      icon: "☀️",
    },
    1: {
      condition: "Mostly clear",
      icon: "🌤️",
    },
    2: {
      condition: "Partly cloudy",
      icon: "⛅",
    },
    3: {
      condition: "Cloudy",
      icon: "☁️",
    },
    45: {
      condition: "Foggy",
      icon: "🌫️",
    },
    48: {
      condition: "Foggy",
      icon: "🌫️",
    },
    51: {
      condition: "Light drizzle",
      icon: "🌦️",
    },
    53: {
      condition: "Drizzle",
      icon: "🌦️",
    },
    55: {
      condition: "Heavy drizzle",
      icon: "🌧️",
    },
    61: {
      condition: "Light rain",
      icon: "🌦️",
    },
    63: {
      condition: "Rain",
      icon: "🌧️",
    },
    65: {
      condition: "Heavy rain",
      icon: "🌧️",
    },
    71: {
      condition: "Light snow",
      icon: "🌨️",
    },
    73: {
      condition: "Snow",
      icon: "❄️",
    },
    75: {
      condition: "Heavy snow",
      icon: "❄️",
    },
    80: {
      condition: "Rain showers",
      icon: "🌦️",
    },
    81: {
      condition: "Rain showers",
      icon: "🌧️",
    },
    82: {
      condition: "Heavy rain showers",
      icon: "🌧️",
    },
    95: {
      condition: "Thunderstorms",
      icon: "⛈️",
    },
    96: {
      condition: "Thunderstorms",
      icon: "⛈️",
    },
    99: {
      condition: "Thunderstorms",
      icon: "⛈️",
    },
  };

  return (
    weather[code] || {
      condition: "Unknown",
      icon: "🌤️",
    }
  );
};

export const getWeather = async (city) => {
  if (!city) {
    throw new Error("No city provided.");
  }

  // Convert city name into coordinates
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1&language=en&format=json`
  );

  if (!geoResponse.ok) {
    throw new Error("Unable to find location.");
  }

  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Location not found.");
  }

  const location = geoData.results[0];

  // Get forecast
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto&forecast_days=2`
  );

  if (!weatherResponse.ok) {
    throw new Error("Unable to get weather.");
  }

  const weatherData = await weatherResponse.json();

  const tomorrow = {
    high: Math.round(
      weatherData.daily.temperature_2m_max[1]
    ),
    low: Math.round(
      weatherData.daily.temperature_2m_min[1]
    ),
    ...getWeatherCode(
      weatherData.daily.weather_code[1]
    ),
  };

  return {
    city: location.name,
    state: location.admin1,
    country: location.country,
    tomorrow,
  };
};