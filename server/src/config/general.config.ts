export default () => ({
  app: {
    port: parseInt(process.env.PORT) || 3000
  },
  weather: {
    apiKey: process.env.WEATHER_API_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET
  }
});