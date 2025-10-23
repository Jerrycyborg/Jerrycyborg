import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Localization from 'expo-localization';
import i18n from '../localization/i18n';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [offlineMode, setOfflineMode] = useState(true);

  const toggleLanguage = () => {
    const nextLanguage = language === 'ta' ? 'en' : 'ta';
    i18n.changeLanguage(nextLanguage);
    setLanguage(nextLanguage);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('settings.title')}</Text>
      <View style={styles.item}>
        <View>
          <Text style={styles.itemTitle}>{t('settings.language')}</Text>
          <Text style={styles.itemSubtitle}>
            {language === 'ta' ? 'தமிழ்' : 'English'} ({Localization.timezone})
          </Text>
        </View>
        <Switch value={language === 'ta'} onValueChange={toggleLanguage} accessibilityLabel={t('settings.language')} />
      </View>
      <View style={styles.item}>
        <View>
          <Text style={styles.itemTitle}>{t('settings.offlineMode')}</Text>
          <Text style={styles.itemSubtitle}>{t('settings.offlineDescription')}</Text>
        </View>
        <Switch
          value={offlineMode}
          onValueChange={setOfflineMode}
          accessibilityLabel={t('settings.offlineMode')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF7'
  },
  content: {
    padding: 24,
    gap: 20
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#141826'
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#141826'
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#141826AA',
    marginTop: 4,
    maxWidth: 220
  }
});
