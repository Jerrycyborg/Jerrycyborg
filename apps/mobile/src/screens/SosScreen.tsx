import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function SosScreen() {
  const { t } = useTranslation();
  const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

  const triggerSos = async () => {
    try {
      await axios.post(`${API_URL}/api/alert/sos`, {
        parentId: 'parent-seed',
        message: 'Immediate assistance requested'
      });
      Alert.alert(t('sos.sent'));
    } catch (err) {
      Alert.alert(t('sos.failed'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('sos.title')}</Text>
      <Text style={styles.subtitle}>{t('sos.subtitle')}</Text>
      <Pressable style={styles.button} onPress={triggerSos}>
        <Text style={styles.buttonText}>{t('sos.button')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#141826'
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#141826AA',
    textAlign: 'center'
  },
  button: {
    marginTop: 40,
    backgroundColor: '#C62828',
    paddingHorizontal: 48,
    paddingVertical: 20,
    borderRadius: 999,
    minWidth: 240
  },
  buttonText: {
    fontSize: 24,
    color: '#FAFAF7',
    textAlign: 'center',
    fontWeight: '700'
  }
});
