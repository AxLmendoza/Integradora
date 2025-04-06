import { LinkProps } from 'expo-router';

declare module 'expo-router' {
  interface LinkProps {
    href: 
      | '/'
      | '/inicio_ses'
      | '/buscar_pre'
      | '/grupos_estu'
      | '/chat'
      | '/elegir'
      | '/grupos'
      | '/(tabs)/menu'
      | '/(tabs)/usuario'
      | `/${string}`;
  }
}