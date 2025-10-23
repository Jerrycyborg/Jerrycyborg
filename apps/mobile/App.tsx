import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SosScreen from './src/screens/SosScreen';
import i18n from './src/localization/i18n';
import useOfflineSync from './src/hooks/useOfflineSync';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
  const { hydrateQueue } = useOfflineSync();

  useEffect(() => {
    hydrateQueue();
  }, [hydrateQueue]);

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Tab.Navigator screenOptions={{ headerShown: false }}>
              <Tab.Screen name="Home" component={HomeScreen} options={{ title: i18n.t('tabs.home') }} />
              <Tab.Screen name="SOS" component={SosScreen} options={{ title: i18n.t('tabs.sos') }} />
              <Tab.Screen name="History" component={HistoryScreen} options={{ title: i18n.t('tabs.history') }} />
              <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: i18n.t('tabs.settings') }} />
            </Tab.Navigator>
          </NavigationContainer>
        </QueryClientProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
