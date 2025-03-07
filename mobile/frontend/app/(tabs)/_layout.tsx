import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        // Oculta la barra superior
        headerShown: false,
        // Oculta la barra inferior
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="home" options={{ title: 'Mi Home' }} />
    </Tabs>
  );
}
