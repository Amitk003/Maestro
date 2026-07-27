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
      `https://api.openweathermap.org/data/2.5/weather?q=${process.env.WEATHER_CITY || 'London'}&units=metric&appid=${apiKey}`
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
  const day = new Date().getDate();
  const seed = (day * 7 + hour * 13) % 10;
  if (seed < 3) {
    return { condition: 'sunny', temp_celsius: 18 + hour % 8, description: 'Clear skies' };
  }
  if (seed < 5) {
    return { condition: 'rainy', temp_celsius: 10 + hour % 5, description: 'Light rain' };
  }
  if (seed < 7) {
    return { condition: 'cold', temp_celsius: 2 + hour % 4, description: 'Chilly breeze' };
  }
  if (seed < 9) {
    return { condition: 'stormy', temp_celsius: 8 + hour % 3, description: 'Heavy winds' };
  }
  return { condition: 'sunny', temp_celsius: 20, description: 'Pleasant weather' };
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
