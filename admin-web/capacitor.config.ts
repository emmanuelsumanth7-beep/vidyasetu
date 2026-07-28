import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vidyasetu.app',
  appName: 'Jnanasagara International Public School',
  webDir: 'out',
  server: {
    url: 'https://admin-web-seven-bay.vercel.app',
    cleartext: false
  }
};

export default config;
