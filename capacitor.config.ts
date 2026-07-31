import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'za.co.deezineit.habitbuddy',
  appName: 'Habit Buddy',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
