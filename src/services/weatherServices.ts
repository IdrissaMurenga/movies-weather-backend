import { GraphQLError } from "graphql";
import { configEnv } from "../config/env.js";

export const getCurrentWeather = async (city: string) => {

    const weatherKey = configEnv.OPEN_WEATHER_KEY
    const weatherBase = configEnv.WEATHER_PROVIDER

    if (!city) throw new GraphQLError("City is required");
    if (!weatherKey) throw new GraphQLError("OPENWEATHER_API_KEY missing");

    const url = `${weatherBase}weather?q=${encodeURIComponent(city)}&appid=${weatherKey}`;
    const res = await fetch(url);
    if (!res.ok)
    throw new GraphQLError(`OpenWeather request failed (${res.status})`);

    const data = await res.json();
    if (data.cod && Number(data.cod) !== 200) {
    throw new GraphQLError(data.message || "Failed to fetch weather");
    }

    const w0 = data.weather?.[0] || {};
    const icon = w0.icon || "01d";

    return {
        city: data.name ?? city,
        country: data.sys?.country,
        description: w0.description || "clear sky",
        icon,
        iconUrl: `https://openweathermap.org/img/wn/${icon}@2x.png`,
        temp: Number(data.main?.temp ?? 0),
        feelsLike: Number(data.main?.feels_like ?? 0),
        humidity: Number(data.main?.humidity ?? 0),
        windSpeed: Number(data.wind?.speed ?? 0),
    };
}