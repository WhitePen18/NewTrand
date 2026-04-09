import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ---- IMPORTANT ----
// Reverted to fetching from GitHub URL as `require()` for JSON is not compatible
// with all React Native environments (web, android).
// Ensure this URL points to your *publicly accessible* trends.json.
const TRENDS_DATA_URL = 'https://raw.githubusercontent.com/whitepen/NewTrand/main/data/trends.json';
// ---- IMPORTANT ----


const CategoryColors = {
  technology: '#4f46e5',
  oil_market: '#ea580c',
  oss_governance: '#16a34a',
  revenue_opportunity: '#d946ef',
};

const TrendItem = ({ item, isDark }) => {
  const badgeColor = CategoryColors[item.category] || '#6b7280';
  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.date, isDark && styles.textLight]}>📅 {item.date}</Text>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{item.source}</Text>
        </View>
      </View>
      <Text style={[styles.title, isDark && styles.textLight]}>{item.title}</Text>
      <Text style={[styles.summary, isDark && styles.textMuted]}>{item.summary}</Text>
      <TouchableOpacity
        style={styles.linkBtn}
        onPress={() => Linking.openURL(item.link)}
      >
        <Text style={styles.linkText}>อ่านรายละเอียด 🌐</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const response = await fetch(TRENDS_DATA_URL);
        if (!response.ok) {
          // Handle HTTP errors (like 404, 500)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Process and sort data
        const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));
        setTrends(sorted);
        setError(null); // Clear any previous errors
      } catch (e) {
        console.error("Failed to load trends:", e);
        setError('ไม่สามารถโหลดข้อมูลเทรนด์ได้'); // Set a user-friendly error message
      } finally {
        setLoading(false);
      }
    };
    loadTrends();
  }, []);

  if (loading) {
    return (
      <View style={[styles.centered, isDark && styles.bgDark]}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={isDark ? styles.textLight : styles.textMuted}>กำลังโหลดเทรนด์…</Text>
      </View>
    );
  }

  if (error) {
     return (
      <View style={[styles.centered, isDark && styles.bgDark]}>
        <Text style={[styles.errorText, isDark && styles.textLight]}>{error}</Text>
        <TouchableOpacity onPress={() => { setLoading(true); setError(null); /* Re-fetch */ }} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>ลองโหลดใหม่</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Group trends by date for rendering
  const grouped = {};
  trends.forEach((t) => {
    grouped[t.date] = grouped[t.date] || [];
    grouped[t.date].push(t);
  });
  const days = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <SafeAreaView style={[styles.root, isDark && styles.bgDark]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={styles.headerEmoji}>🦞</Text>
        <Text style={styles.headerTitle}>Trend Insight</Text>
        <Text style={styles.headerSub}>by น้องแดง</Text>
      </View>

      {/* Content */}
      <FlatList
        data={days}
        keyExtractor={(day) => day}
        contentContainerStyle={styles.list}
        renderItem={({ item: day }) => (
          <View>
            <View style={styles.dayHeader}>
              <Text style={[styles.dayTitle, isDark && styles.textLight]}>
                📆 {day}
              </Text>
              <Text style={[styles.dayCount, isDark && styles.textMuted]}>
                {grouped[day].length} เทรนด์
              </Text>
            </View>
            {grouped[day].map((trend, idx) => (
              <TrendItem key={idx} item={trend} isDark={isDark} />
            ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f0f4ff' },
  bgDark: { backgroundColor: '#111827' },
  textLight: { color: '#f3f4f6' },
  textMuted: { color: '#9ca3af' },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 8 },

  // Header
  header: {
    backgroundColor: '#4f46e5', // Default blue gradient
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center', // Center content within header
  },
  headerDark: { backgroundColor: '#1f2937' }, // Dark mode header gradient
  headerEmoji: { fontSize: 40 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 4 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 2 },

  // Day section
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 18, // Slightly more padding
  },
  dayTitle: { fontSize: 18, fontWeight: '700', color: '#1f2a44' },
  dayCount: { fontSize: 13, color: '#6b7280' },

  // List
  list: { paddingHorizontal: 12, paddingBottom: 30 },

  // Card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 4,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#1f2937',
    shadowColor: '#ffffff', // Adjust shadow for dark mode cards
    shadowOpacity: 0.15,
  },

  // Card header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: { fontSize: 12, color: '#6b7280' },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  // Text
  title: { fontSize: 17, fontWeight: '700', color: '#1f2a44', marginBottom: 6 },
  summary: { fontSize: 14, color: '#374151', lineHeight: 20, marginBottom: 10 },

  // Link button
  linkBtn: {
    backgroundColor: '#eef2ff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  linkText: { color: '#4f46e5', fontSize: 13, fontWeight: '600' },

  // Centered for loading/error states
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
  },
  retryButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});