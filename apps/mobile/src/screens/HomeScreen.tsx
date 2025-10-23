import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useCheckInQueue } from '../hooks/useOfflineSync';

const moods = [
  { key: 'happy', label: '🙂' },
  { key: 'ok', label: '😐' },
  { key: 'sad', label: '☹️' }
];

export default function HomeScreen() {
  const { t } = useTranslation();
  const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [voiceUri, setVoiceUri] = useState<string | null>(null);
  const { enqueue } = useCheckInQueue();

  const handleMood = async (mood: string) => {
    const payload = { mood, parentId: 'parent-seed', voiceUrl: voiceUri };
    try {
      await axios.post(`${API_URL}/api/checkin`, payload);
      Alert.alert(t('home.sent'));    
    } catch (err) {
      enqueue(payload);
      Alert.alert(t('home.offlineSaved'));
    }
  };

  const startRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('home.permissionDenied'));
      return;
    }
    const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    setRecording(newRecording);
  };

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setVoiceUri(uri || null);
    setRecording(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.title')}</Text>
      <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      <View style={styles.moodRow}>
        {moods.map((mood) => (
          <Pressable key={mood.key} style={styles.moodButton} onPress={() => handleMood(mood.key)}>
            <Text style={styles.moodEmoji}>{mood.label}</Text>
            <Text style={styles.moodLabel}>{t(`home.moods.${mood.key}`)}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.voiceCard}>
        <Text style={styles.voiceTitle}>{t('home.voiceNote')}</Text>
        <Text style={styles.voiceDescription}>{voiceUri ? t('home.voiceReady') : t('home.voicePrompt')}</Text>
        <Pressable style={styles.voiceButton} onPress={recording ? stopRecording : startRecording}>
          <Text style={styles.voiceButtonText}>{recording ? t('home.stop') : t('home.record')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF7',
    padding: 24,
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    color: '#141826',
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 16,
    color: '#141826AA'
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24
  },
  moodButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: 100,
    elevation: 2
  },
  moodEmoji: {
    fontSize: 40
  },
  moodLabel: {
    marginTop: 8,
    fontSize: 16,
    color: '#141826'
  },
  voiceCard: {
    backgroundColor: '#11847315',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center'
  },
  voiceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#141826'
  },
  voiceDescription: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#141826AA'
  },
  voiceButton: {
    marginTop: 16,
    backgroundColor: '#118473',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12
  },
  voiceButtonText: {
    color: '#FAFAF7',
    fontSize: 16,
    fontWeight: '600'
  }
});
