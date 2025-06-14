export default () => ({
  CITY_CACHE: {
    PREFIX: process.env.CITY_CACHE_PREFIX,
    TTL: Number(process.env.CITY_CACHE_TTL),
  },
});
