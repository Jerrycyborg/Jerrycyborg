import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const QUEUE_KEY = 'pariconnect-checkins';

type CheckInPayload = {
  mood: string;
  parentId: string;
  voiceUrl?: string | null;
  queuedAt?: number;
};

export function useCheckInQueue() {
  const enqueue = useCallback(async (payload: CheckInPayload) => {
    const existing = await AsyncStorage.getItem(QUEUE_KEY);
    const queue: CheckInPayload[] = existing ? JSON.parse(existing) : [];
    queue.push({ ...payload, queuedAt: Date.now() });
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }, []);

  return { enqueue };
}

export default function useOfflineSync() {
  const hydrateQueue = useCallback(async () => {
    const existing = await AsyncStorage.getItem(QUEUE_KEY);
    if (!existing) return;
    const queue: CheckInPayload[] = JSON.parse(existing);
    const remaining: CheckInPayload[] = [];

    const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

    for (const item of queue) {
      try {
        await axios.post(`${apiUrl}/api/checkin`, item);
      } catch (err) {
        remaining.push(item);
      }
    }

    if (remaining.length) {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
    } else {
      await AsyncStorage.removeItem(QUEUE_KEY);
    }
  }, []);

  return { hydrateQueue };
}
