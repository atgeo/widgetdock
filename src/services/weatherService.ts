type WeatherIcon = string | { 0: string; 1: string }

interface WeatherInfo {
    text: string
    icon: WeatherIcon
}

const weatherCodeMap: Record<number, WeatherInfo> = {
  0: { text: 'Clear sky', icon: { 0: '🌙', 1: '☀️' } },
  1: { text: 'Mainly clear', icon: { 0: '🌙', 1: '🌤️' } },
  2: { text: 'Partly cloudy', icon: { 0: '☁️', 1: '⛅' } },
  3: { text: 'Overcast', icon: '☁️' },

  45: { text: 'Fog', icon: '🌫️' },
  48: { text: 'Depositing rime fog', icon: '🌫️' },

  51: { text: 'Light drizzle', icon: { 0: '🌧️', 1: '🌦' } },
  53: { text: 'Moderate drizzle', icon: { 0: '🌧️', 1: '🌦' } },
  55: { text: 'Dense drizzle', icon: '🌧️' },

  56: { text: 'Freezing drizzle', icon: '🌧️' },
  57: { text: 'Dense freezing drizzle', icon: '🌧️' },

  61: { text: 'Slight rain', icon: '🌧️' },
  63: { text: 'Moderate rain', icon: '🌧️' },
  65: { text: 'Heavy rain', icon: '🌧️' },

  66: { text: 'Light freezing rain', icon: '🌧️' },
  67: { text: 'Heavy freezing rain', icon: '🌧️' },

  71: { text: 'Slight snowfall', icon: '🌨️' },
  73: { text: 'Moderate snowfall', icon: '🌨️' },
  75: { text: 'Heavy snowfall', icon: '🌨️' },

  77: { text: 'Snow grains', icon: '❄️' },

  80: { text: 'Rain showers', icon: '🌧️' },
  81: { text: 'Rain showers', icon: '🌧️' },
  82: { text: 'Violent rain showers', icon: '🌧️' },

  85: { text: 'Snow showers', icon: '🌨️' },
  86: { text: 'Heavy snow showers', icon: '🌨️' },

  95: { text: 'Thunderstorm', icon: '⛈️' },
  96: { text: 'Thunderstorm + hail', icon: '⛈️' },
  99: { text: 'Thunderstorm + heavy hail', icon: '⛈️' },
}

function getConditions (code: number, is_day: number) {
  const data = weatherCodeMap[code] || { text: 'Unknown', icon: '❓' }

  let icon

    if (typeof data.icon === 'object' && data.icon !== null) {
        const key = is_day ? 1 : 0
        icon = data.icon[key] ?? '❓'
    } else {
        icon = data.icon ?? '❓'
    }

  return { text: data.text || 'Unknown', icon }
}

async function getCoordinates (city: string) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
  const res = await fetch(url)
  const data = await res.json()

  if (!data.results?.length) {
    throw new Error(`City not found: ${city}`)
  }

  const { latitude, longitude } = data.results[0]
  return { latitude, longitude }
}

async function getWeather (city: string) {
  try {
    const { latitude, longitude } = await getCoordinates(city)

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    const res = await fetch(url)
    const data = await res.json()

    const cw = data.current_weather
    const desc = getConditions(cw.weathercode, cw.is_day)

    return {
      city,
      temperature: cw.temperature,
      code: cw.weathercode,
      desc,
    }
  } catch (err) {
    console.error(err)
    return { city, error: true }
  }
}

export async function getWeatherForCities (cities: string[]) {
  const promises = cities.map(getWeather)
  return Promise.all(promises)
}
