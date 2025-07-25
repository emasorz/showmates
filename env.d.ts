// env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_KEY: string;
      EXPO_PUBLIC_API_URL: string;
    }
  }