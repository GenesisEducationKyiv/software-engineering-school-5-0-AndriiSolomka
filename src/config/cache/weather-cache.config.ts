export default () => ({
  WEATHER_CACHE: {
    PREFIX: process.env.WEATHER_CACHE_PREFIX,
    TTL: Number(process.env.WEATHER_CACHE_TTL),
  },
});
