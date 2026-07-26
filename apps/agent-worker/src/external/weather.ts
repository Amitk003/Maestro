import type { WeatherInfo } from '@maestro/shared';

const CACHE_TTL_MS = 10 * 60 * 1000;
let cached: { data: WeatherInfo; ts: number } | null = null;
let fallbackCount = 0;

export async function fetchWeather(): Promise<WeatherInfo> {
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data;
  }

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return fallbackWeather();
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${apiKey}`
    );

    if (!res.ok) throw new Error(`Weather API returned ${res.status}`);

    const data = await res.json();
    const weather: WeatherInfo = {
      temp_celsius: Math.round(data.main.temp),
      condition: mapCondition(data.weather[0]?.main || ''),
      description: data.weather[0]?.description || 'clear sky',
    };

    cached = { data: weather, ts: Date.now() };
    fallbackCount = 0;
    return weather;
  } catch {
    fallbackCount++;
    return fallbackWeather();
  }
}

function fallbackWeather(): WeatherInfo {
  const hour = new Date().getHours();
  // Simulate reasonable weather based on time of day
  if (hour >= 6 && hour < 12) {
    return { condition: 'sunny', temp_celsius: 18, description: 'Morning sunshine' };
  }
  if (hour >= 12 && hour < 18) {
    return { condition: 'sunny', temp_celsius: 22, description: 'Afternoon clear skies' };
  }
  if (hour >= 18 && hour < 22) {
    return { condition: 'sunny', temp_celsius: 16, description: 'Cool evening' };
  }
  return { condition: 'rainy', temp_celsius: 10, description: 'Night rain' };
}

function mapCondition(weatherMain: string): WeatherInfo['condition'] {
  switch (weatherMain.toLowerCase()) {
    case 'clear':
    case 'sunny':
      return 'sunny';
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      return 'rainy';
    case 'snow':
    case 'sleet':
      return 'cold';
    case 'storm':
    case 'tornado':
    case 'squall':
      return 'stormy';
    default:
      return 'sunny';
  }
}
