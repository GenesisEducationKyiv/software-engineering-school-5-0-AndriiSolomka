export default () => ({
  EMAIL: {
    CONFIRM_LINK: process.env.EMAIL_CONFIRM_LINK,
    SENDER: process.env.EMAIL_USER,
    PASSWORD: process.env.EMAIL_PASSWORD,
    SERVICE: process.env.EMAIL_SERVICE,
  },
});
