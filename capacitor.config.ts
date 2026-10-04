import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.maruf.levelimpossible',
  appName: 'Level Impossible',
  webDir: 'dist',
  bundledWebRuntime: false,

  android: {
    backgroundColor: '#0b0c13'
  }
};

export default config;