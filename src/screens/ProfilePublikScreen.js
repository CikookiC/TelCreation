// src/screens/ProfilePublikScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilePublikScreen() {
  const user = auth.currentUser;
  const initialLetter = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guest Console</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initialLetter}</Text>
        </View>

        <Text style={styles.userName}>Pengguna Umum</Text>
        <Text style={styles.userEmail}>{user?.email || 'Tamu Eksternal'}</Text>

        <View style={styles.divider} />

        {/* Tombol terminasi dengan outline hitam keabuan */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => signOut(auth)}>
          <Ionicons name="log-out-outline" size={16} color="#1E2022" style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Terminasi Sesi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  header: { backgroundColor: '#1E2022', paddingVertical: 25, alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  profileCard: { backgroundColor: '#FFFFFF', margin: 25, padding: 30, borderRadius: 24, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, borderWidth: 1, borderColor: '#F1F1F5' },
  avatarCircle: { width: 70, height: 70, borderRadius: 24, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#EFEFEF' },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#1E2022' },
  userName: { fontSize: 18, fontWeight: '800', color: '#1E2022' },
  userEmail: { fontSize: 13, color: '#9A9FA5', marginTop: 4, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F1F1F5', width: '100%', marginVertical: 25 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#1E2022', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 16, width: '70%' },
  logoutButtonText: { color: '#1E2022', fontWeight: 'bold', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }
});