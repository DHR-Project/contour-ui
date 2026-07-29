/** @type {import('@ladle/react').UserConfig} */
const config = {
  stories: "components/**/*.stories.{ts,tsx}",
  addons: {
    theme: {
      enabled: true,
      defaultState: "light",
    },
    mode: {
      enabled: true,
    },
    width: {
      enabled: true,
      options: {
        compact: 375,
        regular: 820,
        regularLg: 1024,
        regularXl: 1280,
      },
    },
  },
};

export default config;
