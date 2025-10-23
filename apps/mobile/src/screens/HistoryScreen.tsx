import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface HistoryEntry {
  id: string;
  type: string;
  mood?: string;
  status?: string;
  createdAt: string;
}

export default function HistoryScreen() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

  useEffect(() => {
    axios
      .get(`${API_URL}/api/parent/mock-parent/history`)
      .then((res) => setEntries(res.data.entries ?? []))
      .catch(() => setEntries([]));
  }, [API_URL]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('history.title')}</Text>
      {entries.length === 0 && <Text style={styles.empty}>{t('history.empty')}</Text>}
      {entries.map((entry) => (
        <View key={entry.id} style={styles.card}>
          <Text style={styles.cardTitle}>{t(`history.types.${entry.type}`, entry.type)}</Text>
          <Text style={styles.cardSubtitle}>{new Date(entry.createdAt).toLocaleString()}</Text>
          {entry.mood && <Text style={styles.cardBody}>{t('history.mood', { mood: entry.mood })}</Text>}
          {entry.status && <Text style={styles.cardBody}>{t('history.status', { status: entry.status })}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF7'
  },
  content: {
    padding: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#141826',
    marginBottom: 16
  },
  empty: {
    fontSize: 16,
    color: '#141826AA'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#141826'
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 4,
    color: '#14182680'
  },
  cardBody: {
    marginTop: 8,
    fontSize: 14,
    color: '#141826'
  }
});
