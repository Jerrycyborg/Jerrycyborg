import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      tabs: {
        home: 'Home',
        sos: 'SOS',
        history: 'History',
        settings: 'Settings'
      },
      home: {
        title: 'How are you feeling today?',
        subtitle: 'Tap an emoji to send a quick update. Optional 10-second voice note.',
        moods: {
          happy: 'Great',
          ok: 'Okay',
          sad: 'Not great'
        },
        voiceNote: 'Voice note',
        voicePrompt: 'Record a short message for your family.',
        voiceReady: 'Saved. Sent automatically with your mood.',
        record: 'Record',
        stop: 'Stop',
        sent: 'Check-in sent! 💚',
        offlineSaved: 'You are offline. We will send this when back online.',
        permissionDenied: 'Microphone permission denied.'
      },
      sos: {
        title: 'Need help?',
        subtitle: 'The PariConnect team and your family will be alerted instantly.',
        button: 'Send SOS',
        sent: 'SOS sent. Help is on the way.',
        failed: 'Could not send SOS. We saved it to retry.'
      },
      history: {
        title: 'Recent updates',
        empty: 'No activity recorded yet.',
        types: {
          checkin: 'Check-in',
          visit: 'Caregiver visit',
          alert: 'Alert'
        },
        mood: 'Mood: {{mood}}',
        status: 'Status: {{status}}'
      },
      settings: {
        title: 'Settings',
        language: 'Tamil language',
        offlineMode: 'Offline sync',
        offlineDescription: 'Automatically sync check-ins when internet is back.'
      }
    }
  },
  ta: {
    translation: {
      tabs: {
        home: 'முகப்பு',
        sos: 'அவசரம்',
        history: 'வரலாறு',
        settings: 'அமைப்புகள்'
      },
      home: {
        title: 'இன்று எப்படி இருக்கிறீர்கள்?',
        subtitle: 'ஒரு எமோஜியை தட்டுங்கள். விருப்பமான குரல் குறிப்பை அனுப்பலாம்.',
        moods: {
          happy: 'சந்தோஷம்',
          ok: 'சராசரி',
          sad: 'சோர்வு'
        },
        voiceNote: 'குரல் குறிப்பு',
        voicePrompt: 'குடும்பத்திற்கு குறுகிய செய்தியை பதிவு செய்யுங்கள்.',
        voiceReady: 'சேமிக்கப்பட்டது. உங்கள் உணர்வுடன் அனுப்பப்படும்.',
        record: 'பதிவு',
        stop: 'நிறுத்து',
        sent: 'அறிக்கை அனுப்பப்பட்டது! 💚',
        offlineSaved: 'இணையம் இல்லை. இணையம் வந்தால் அனுப்பப்படும்.',
        permissionDenied: 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது.'
      },
      sos: {
        title: 'உங்களுக்கு உதவி வேண்டுமா?',
        subtitle: 'உங்கள் குடும்பத்துக்கும் பரி கனெக்ட் குழுவுக்கும் உடனடியாக தகவல் செல்லும்.',
        button: 'SOS அனுப்பு',
        sent: 'SOS அனுப்பப்பட்டது. உதவி வருகிறோம்.',
        failed: 'SOS அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கிறது.'
      },
      history: {
        title: 'சமீபத்திய புதுப்பிப்புகள்',
        empty: 'இன்னும் செயல்பாடு இல்லை.',
        types: {
          checkin: 'செக்-இன்',
          visit: 'பராமரிப்பு வருகை',
          alert: 'எச்சரிக்கை'
        },
        mood: 'உணர்வு: {{mood}}',
        status: 'நிலை: {{status}}'
      },
      settings: {
        title: 'அமைப்புகள்',
        language: 'தமிழ் மொழி',
        offlineMode: 'ஆஃப்லைன் ஒத்திசைவு',
        offlineDescription: 'இணையம் வந்தவுடன் செக்-இன்கள் தானாக அனுப்பப்படும்.'
      }
    }
  }
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'ta',
  fallbackLng: 'en',
  resources,
  interpolation: { escapeValue: false }
});

export default i18n;
