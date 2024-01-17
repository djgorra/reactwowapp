export default () => {
    return {
      name: process.env.APP_ENV === 'production' ? 'RaidCraft' : 'RaidCraft (DEV)',
      ios: {
        bundleIdentifier: process.env.APP_ENV === 'production' ? 'com.raidcraft' : 'com.raidcraft.dev',
      },
      // ... other config here
    };
  };
  