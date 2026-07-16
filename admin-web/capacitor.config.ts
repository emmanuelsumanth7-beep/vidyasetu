import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eduportal.app',
  appName: 'EduPortal',
  webDir: 'out',
  server: {
    url: 'https://bot.smha.co.in',
    cleartext: true
  }
};

export default config;
