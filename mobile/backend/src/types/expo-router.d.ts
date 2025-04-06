import { LinkProps } from 'expo-router';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      '/': undefined;
      '/inicio_ses': undefined;
      '/buscar_pre': { query: string };
      '/grupos_estu': undefined;
      '/chat': undefined;
      '/elegir': undefined;
      '/grupos': undefined;
      '/(tabs)/menu': undefined;
      '/(tabs)/usuario': undefined;
      [key: `/${string}`]: undefined;
    }
  }
}